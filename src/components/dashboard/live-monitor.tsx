import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { sortifyApi, type Telemetry } from "@/lib/sortify-api";

export function LiveMonitor() {
  const [ts, setTs] = useState<string>("");
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

  useEffect(() => {
    const update = () =>
      setTs(new Date().toISOString().slice(0, 19).replace("T", " "));
    update();
    const id = setInterval(update, 1000);

    const fetchTelemetry = async () => {
      try {
        const data = await sortifyApi.telemetry();
        setTelemetry(data);
      } catch (err) {
        console.error("LiveMonitor: failed to fetch telemetry:", err);
      }
    };
    fetchTelemetry();
    const telId = setInterval(fetchTelemetry, 2500);

    return () => {
      clearInterval(id);
      clearInterval(telId);
    };
  }, []);
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Live Camera Feed
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-danger">
          <span className="h-1.5 w-1.5 rounded-full bg-danger pulse-dot" />
          Recording
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-primary/20 bg-[#050810]">
        {/* Simulated feed background */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, oklch(0.35 0.08 200) 0%, transparent 45%), radial-gradient(circle at 70% 60%, oklch(0.28 0.05 260) 0%, transparent 50%), linear-gradient(180deg, #061020 0%, #0a1428 100%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.85 0.18 210 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.85 0.18 210 / 0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Scan line */}
        <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-primary/40 to-transparent scan" />

        {/* Bounding box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute left-[32%] top-[28%] h-[44%] w-[36%]"
        >
          <div className="relative h-full w-full rounded-md border-2 border-primary glow-cyan">
            <Corner className="-top-1 -left-1" />
            <Corner className="-top-1 -right-1 rotate-90" />
            <Corner className="-bottom-1 -right-1 rotate-180" />
            <Corner className="-bottom-1 -left-1 -rotate-90" />
            <div className="absolute -top-7 left-0 rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-bold text-primary-foreground">
              {telemetry ? (telemetry.metalDetected ? "METAL" : telemetry.irActive ? "ORGANIC" : "PLASTIC") : "PLASTIC"} · {telemetry?.metalDetected ? "94.8%" : "96.4%"}
            </div>
          </div>
        </motion.div>

        {/* HUD stats */}
        <div className="absolute left-3 top-3 space-y-1 font-mono text-[10px] uppercase tracking-widest text-primary/80">
          <div>{telemetry?.device ?? "ESP32-001"} · 1080p · 30fps</div>
          <div>LAT {telemetry?.avgProcessingMs ?? 42} ms</div>
        </div>
        <div
          className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-primary/80"
          suppressHydrationWarning
        >
          {ts}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Prediction" value={telemetry ? (telemetry.metalDetected ? "Metal" : telemetry.irActive ? "Organic" : "Plastic") : "Plastic"} accent />
        <Stat label="Confidence" value={telemetry?.metalDetected ? "94.8%" : "96.4%"} />
        <Stat label="Detection" value={telemetry ? `${telemetry.avgProcessingMs} ms` : "42 ms"} />
        <Stat label="Frame" value={telemetry ? `#${(telemetry.timestamp % 100000)}` : "#28,417"} />
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/5 px-3 py-2 text-xs text-accent-foreground/90">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span>
          Neural model <span className="font-mono text-accent">sortify-v2.3</span> inferring in
          real-time on edge.
        </span>
      </div>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute h-3 w-3 border-l-2 border-t-2 border-primary ${className}`} />
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-mono text-sm font-bold ${accent ? "text-primary text-glow-cyan" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}