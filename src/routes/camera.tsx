import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { WASTE_COLORS, type WasteType } from "@/lib/mock";
import { motion } from "framer-motion";

export const Route = createFileRoute("/camera")({
  component: Page,
  head: () => ({ meta: [{ title: "Camera Feed — SORTIFY AI" }] }),
});

const SAMPLES: { label: string; waste: WasteType; emoji: string }[] = [
  { label: "Plastic Bottle", waste: "Plastic", emoji: "🧴" },
  { label: "Paper Cup", waste: "Paper", emoji: "🥤" },
  { label: "Glass Bottle", waste: "Glass", emoji: "🍾" },
  { label: "Food Waste", waste: "Organic", emoji: "🍽️" },
  { label: "Banana Peel", waste: "Organic", emoji: "🍌" },
  { label: "Aluminum Can", waste: "Metal", emoji: "🥫" },
  { label: "Milk Carton", waste: "Cardboard", emoji: "🥛" },
  { label: "Cardboard Box", waste: "Cardboard", emoji: "📦" },
];

const CAMERAS = [
  { id: "CAM-01", name: "Sorting Conveyor", device: "ESP32-014", area: "Sector A - Conveyor" },
  { id: "CAM-02", name: "Plastic Bin", device: "ESP32-021", area: "Sector B - Recycling" },
  { id: "CAM-03", name: "Metal Bin", device: "ESP32-027", area: "Sorting Line 1" },
  { id: "CAM-04", name: "Organic Bin", device: "ESP32-033", area: "Sector C - Organic" },
];

function Page() {
  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Live <span className="text-primary text-glow-cyan">Camera Feed</span>
            </h1>
            <p className="text-sm text-muted-foreground">Real-time YOLO-v8 detections across active edge cameras.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CAMERAS.map((c) => (
            <CameraCard key={c.id} {...c} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function CameraCard({ id, name, device, area }: { id: string; name: string; device: string; area: string }) {
  const [i, setI] = useState(() => Math.floor(Math.random() * SAMPLES.length));
  const [conf, setConf] = useState(0.94);
  const [ts, setTs] = useState<string>("");
  const [weight, setWeight] = useState(0.42);

  useEffect(() => {
    setTs(new Date().toLocaleTimeString([], { hour12: false }));
    const id = setInterval(() => {
      setI(Math.floor(Math.random() * SAMPLES.length));
      setConf(+(0.72 + Math.random() * 0.27).toFixed(3));
      setWeight(+(0.05 + Math.random() * 1.8).toFixed(2));
      setTs(new Date().toLocaleTimeString([], { hour12: false }));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const s = SAMPLES[i]!;
  const color = WASTE_COLORS[s.waste];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-muted-foreground">{id}</div>
          <div className="font-semibold text-foreground">{name}</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase text-danger">
          <span className="h-1.5 w-1.5 rounded-full bg-danger pulse-dot" /> Live
        </div>
      </div>

      <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.6))]" />
        <div className="absolute inset-0 grid place-items-center text-7xl">{s.emoji}</div>

        {/* scan line */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-primary/40 to-transparent scan" />

        {/* bounding box */}
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute rounded-md"
          style={{
            left: `${20 + Math.random() * 20}%`,
            top: `${18 + Math.random() * 15}%`,
            width: `${40 + Math.random() * 15}%`,
            height: `${45 + Math.random() * 12}%`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 12px ${color}`,
          }}
        >
          <div className="absolute -top-6 left-0 whitespace-nowrap rounded-t px-1.5 py-0.5 text-[10px] font-bold text-black" style={{ background: color }}>
            {s.waste} · {(conf * 100).toFixed(1)}%
          </div>
        </motion.div>

        {/* corner brackets */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((p) => (
          <span key={p} className={`absolute ${p} h-3 w-3 border-primary/70`}
            style={{ borderTop: p.includes("top") ? "2px solid" : "none", borderBottom: p.includes("bottom") ? "2px solid" : "none",
              borderLeft: p.includes("left") ? "2px solid" : "none", borderRight: p.includes("right") ? "2px solid" : "none" }} />
        ))}

        {/* HUD */}
        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-primary">
          {device} · 1080p · 30fps
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-primary" suppressHydrationWarning>
          {ts}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <Info label="Class" value={s.waste} color={color} />
        <Info label="Confidence" value={`${(conf * 100).toFixed(1)}%`} />
        <Info label="Weight" value={`${weight} kg`} />
        <Info label="Device" value={device} />
        <Info label="Area" value={area} />
        <Info label="Status" value="Sorted" ok />
      </div>
    </div>
  );
}

function Info({ label, value, color, ok }: { label: string; value: string; color?: string; ok?: boolean }) {
  return (
    <div className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold text-foreground truncate" style={color ? { color } : undefined}>
        {ok ? <span className="text-success">{value}</span> : value}
      </div>
    </div>
  );
}
