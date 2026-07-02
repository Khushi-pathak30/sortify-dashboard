import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { Activity, Wifi, Cloud, Ruler, Magnet, Radio, Cog } from "lucide-react";
import { WASTE_COLORS, type WasteType } from "@/lib/mock";
import { sortifyApi, type LiveEvent, type Telemetry } from "@/lib/sortify-api";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/live")({
  component: Page,
  head: () => ({ meta: [{ title: "Live Monitoring — SORTIFY AI" }] }),
});

function Page() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live events: prefer SSE, fall back to polling /api/live/events.
  useEffect(() => {
    let cancelled = false;
    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const pushEvent = (e: LiveEvent) => {
      setEvents((prev) => {
        if (prev.some((p) => p.id === e.id)) return prev;
        return [e, ...prev].slice(0, 12);
      });
    };

    const startPolling = () => {
      let since = Date.now();
      const tick = async () => {
        try {
          const res = await sortifyApi.events(since, 12);
          if (cancelled) return;
          setConnected(true);
          setError(null);
          // API returns newest-first; push oldest first so latest lands on top.
          const batch = [...res.data].reverse();
          batch.forEach(pushEvent);
          if (res.data[0]) since = res.data[0].timestamp;
        } catch (err) {
          if (cancelled) return;
          setConnected(false);
          setError((err as Error).message);
        }
      };
      tick();
      pollTimer = setInterval(tick, 2500);
    };

    try {
      es = new EventSource(sortifyApi.streamUrl());
      es.onopen = () => {
        setConnected(true);
        setError(null);
      };
      es.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data) as LiveEvent;
          pushEvent(data);
        } catch {
          /* ignore malformed */
        }
      };
      es.onerror = () => {
        setConnected(false);
        es?.close();
        es = null;
        if (!pollTimer) startPolling();
      };
    } catch {
      startPolling();
    }

    return () => {
      cancelled = true;
      es?.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  // Sensor telemetry poll.
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const t = await sortifyApi.telemetry();
        if (!cancelled) setTelemetry(t);
      } catch {
        /* handled by events stream error state */
      }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Live <span className="text-primary text-glow-cyan">Monitoring</span>
            </h1>
            <p className="text-sm text-muted-foreground">Streaming detection events from all connected devices.</p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
              connected
                ? "border-success/30 bg-success/10 text-success"
                : "border-danger/30 bg-danger/10 text-danger"
            }`}
            title={error ?? undefined}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-success pulse-dot" : "bg-danger"}`} />
            {connected ? "Streaming" : "Disconnected"}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Live Waste Detection</h3>
              <span className="text-xs text-muted-foreground">Latest 12 events</span>
            </div>
            <div className="mt-3 divide-y divide-primary/10">
              <AnimatePresence initial={false}>
                {events.map((e) => (
                  <motion.div key={e.id}
                    initial={{ opacity: 0, y: -8, backgroundColor: "rgba(59, 191, 248, 0.15)" }}
                    animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-6 gap-2 py-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: WASTE_COLORS[e.waste as WasteType] ?? "#3bbff8" }}
                      />
                      <span className="font-semibold text-foreground">{e.waste}</span>
                    </div>
                    <div className="font-mono text-muted-foreground">{e.weightKg} kg</div>
                    <div className="font-mono text-muted-foreground" suppressHydrationWarning>
                      {new Date(e.timestamp).toLocaleTimeString([], { hour12: false })}
                    </div>
                    <div className="font-mono text-primary">{e.device}</div>
                    <div className="text-muted-foreground truncate">{e.bin}</div>
                    <div className="text-muted-foreground truncate">{e.area}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {error ? `Backend unreachable: ${error}` : "Waiting for detections…"}
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-foreground">Sensor Telemetry</h3>
            <div className="mt-3 space-y-2">
              <SensorRow icon={<Ruler className="h-4 w-4" />} label="Distance" value={telemetry ? `${telemetry.distanceCm} cm` : "—"} />
              <SensorRow icon={<Magnet className="h-4 w-4" />} label="Metal" value={telemetry?.metalDetected ? "Detected" : "None"} ok={telemetry?.metalDetected} />
              <SensorRow icon={<Radio className="h-4 w-4" />} label="IR Sensor" value={telemetry?.irActive ? "Active" : "No signal"} ok={telemetry?.irActive} />
              <SensorRow icon={<Cog className="h-4 w-4" />} label="Servo" value={telemetry ? `${telemetry.servoAngle}°` : "—"} />
              <SensorRow icon={<Wifi className="h-4 w-4" />} label="Wi-Fi" value={telemetry ? `${telemetry.wifiDbm} dBm` : "—"} ok={telemetry ? telemetry.wifiDbm > -70 : undefined} />
              <SensorRow icon={<Cloud className="h-4 w-4" />} label="Cloud" value={telemetry?.cloudConnected ? "Connected" : "Down"} ok={telemetry?.cloudConnected} />
              <SensorRow icon={<Activity className="h-4 w-4" />} label="Objects" value={telemetry ? String(telemetry.objectsInFrame) : "—"} />
              <SensorRow icon={<Activity className="h-4 w-4" />} label="Avg Processing" value={telemetry ? `${telemetry.avgProcessingMs} ms` : "—"} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SensorRow({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span>{label}</span></div>
      <div className={`font-mono font-semibold ${ok === false ? "text-danger" : ok === true ? "text-success" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
