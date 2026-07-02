import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";
import { Activity, Wifi, Cloud, Ruler, Magnet, Radio, Cog } from "lucide-react";
import { generateDevices, generateBins, WASTE_TYPES, WASTE_COLORS, type WasteType } from "@/lib/mock";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/live")({
  component: Page,
  head: () => ({ meta: [{ title: "Live Monitoring — SORTIFY AI" }] }),
});

type Event = {
  id: string;
  waste: WasteType;
  weight: number;
  device: string;
  area: string;
  bin: string;
  time: string;
};

function Page() {
  const devices = useMemo(() => generateDevices(50), []);
  const bins = useMemo(() => generateBins(120), []);

  const [events, setEvents] = useState<Event[]>([]);
  const [sensors, setSensors] = useState({
    distance: 12, metal: 0, ir: 1, servo: 0, wifi: -55, cloud: true, objects: 0, avgTime: 78,
  });

  useEffect(() => {
    const tick = () => {
      const d = devices[Math.floor(Math.random() * devices.length)]!;
      const b = bins[Math.floor(Math.random() * bins.length)]!;
      const waste = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)]!;
      const e: Event = {
        id: Math.random().toString(36).slice(2, 9),
        waste,
        weight: +(0.05 + Math.random() * 1.6).toFixed(2),
        device: d.id, area: d.area, bin: b.id,
        time: new Date().toLocaleTimeString([], { hour12: false }),
      };
      setEvents((prev) => [e, ...prev].slice(0, 12));
      setSensors({
        distance: Math.floor(2 + Math.random() * 30),
        metal: waste === "Metal" ? 1 : 0,
        ir: Math.random() > 0.1 ? 1 : 0,
        servo: [0, 45, 90, 135, 180][Math.floor(Math.random() * 5)]!,
        wifi: -30 - Math.floor(Math.random() * 60),
        cloud: Math.random() > 0.05,
        objects: (Math.floor(Math.random() * 3) + 1),
        avgTime: 40 + Math.floor(Math.random() * 120),
      });
    };
    tick();
    const id = setInterval(tick, 2500);
    return () => clearInterval(id);
  }, [devices, bins]);

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
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> Streaming
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
                      <span className="h-2 w-2 rounded-full" style={{ background: WASTE_COLORS[e.waste] }} />
                      <span className="font-semibold text-foreground">{e.waste}</span>
                    </div>
                    <div className="font-mono text-muted-foreground">{e.weight} kg</div>
                    <div className="font-mono text-muted-foreground">{e.time}</div>
                    <div className="font-mono text-primary">{e.device}</div>
                    <div className="text-muted-foreground truncate">{e.bin}</div>
                    <div className="text-muted-foreground truncate">{e.area}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">Waiting for detections…</div>}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-foreground">Sensor Telemetry</h3>
            <div className="mt-3 space-y-2">
              <SensorRow icon={<Ruler className="h-4 w-4" />} label="Distance" value={`${sensors.distance} cm`} />
              <SensorRow icon={<Magnet className="h-4 w-4" />} label="Metal" value={sensors.metal ? "Detected" : "None"} ok={!!sensors.metal} />
              <SensorRow icon={<Radio className="h-4 w-4" />} label="IR Sensor" value={sensors.ir ? "Active" : "No signal"} ok={!!sensors.ir} />
              <SensorRow icon={<Cog className="h-4 w-4" />} label="Servo" value={`${sensors.servo}°`} />
              <SensorRow icon={<Wifi className="h-4 w-4" />} label="Wi-Fi" value={`${sensors.wifi} dBm`} ok={sensors.wifi > -70} />
              <SensorRow icon={<Cloud className="h-4 w-4" />} label="Cloud" value={sensors.cloud ? "Connected" : "Down"} ok={sensors.cloud} />
              <SensorRow icon={<Activity className="h-4 w-4" />} label="Objects" value={String(sensors.objects)} />
              <SensorRow icon={<Activity className="h-4 w-4" />} label="Avg Processing" value={`${sensors.avgTime} ms`} />
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
