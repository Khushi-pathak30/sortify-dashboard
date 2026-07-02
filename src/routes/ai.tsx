import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";
import { generateDevices, generatePredictions, WASTE_TYPES, WASTE_COLORS, type WasteType, formatTimeAgo } from "@/lib/mock";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/ai")({
  component: Page,
  head: () => ({ meta: [{ title: "AI Prediction — SORTIFY AI" }] }),
});

function Page() {
  const devices = useMemo(() => generateDevices(50), []);
  const seed = useMemo(() => generatePredictions(500, devices), [devices]);
  const [recent, setRecent] = useState(() => seed.slice(0, 20));
  const [current, setCurrent] = useState(() => seed[0]!);
  const [probs, setProbs] = useState(() => buildProbs(current.waste));

  useEffect(() => {
    const id = setInterval(() => {
      const d = devices[Math.floor(Math.random() * devices.length)]!;
      const waste = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)]!;
      const p = {
        id: "PRD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        waste,
        confidence: +(0.72 + Math.random() * 0.27).toFixed(3),
        device: d.id, area: d.area,
        weightKg: +(0.05 + Math.random() * 1.6).toFixed(2),
        timestamp: Date.now(),
        inferenceMs: 30 + Math.floor(Math.random() * 200),
      };
      setCurrent(p);
      setProbs(buildProbs(waste));
      setRecent((prev) => [p, ...prev].slice(0, 20));
    }, 3000);
    return () => clearInterval(id);
  }, [devices]);

  const top5 = [...probs].sort((a, b) => b.p - a.p).slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            AI <span className="text-primary text-glow-cyan">Prediction Console</span>
          </h1>
          <p className="text-sm text-muted-foreground">Edge Impulse · YOLOv8n · streaming inference from ESP32-CAM fleet.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-primary/20 bg-slate-900">
                <div className="absolute inset-0 grid place-items-center text-7xl">
                  {emojiFor(current.waste)}
                </div>
                <div className="absolute inset-0 scan bg-gradient-to-b from-primary/40 to-transparent h-8" />
                <motion.div key={current.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute rounded-md" style={{
                    left: "25%", top: "20%", width: "50%", height: "55%",
                    border: `2px solid ${WASTE_COLORS[current.waste]}`,
                    boxShadow: `0 0 14px ${WASTE_COLORS[current.waste]}`,
                  }}>
                  <div className="absolute -top-6 left-0 rounded-t px-1.5 py-0.5 text-[10px] font-bold text-black" style={{ background: WASTE_COLORS[current.waste] }}>
                    {current.waste} · {(current.confidence * 100).toFixed(1)}%
                  </div>
                </motion.div>
              </div>

              <div className="space-y-2 text-sm">
                <Field label="Predicted" value={current.waste} color={WASTE_COLORS[current.waste]} />
                <Field label="Confidence" value={`${(current.confidence * 100).toFixed(2)}%`} />
                <Field label="Model" value="YOLOv8n · v2.3.1" />
                <Field label="Inference" value={`${current.inferenceMs} ms`} />
                <Field label="Device" value={current.device} />
                <Field label="Area" value={current.area} />
                <Field label="Weight" value={`${current.weightKg} kg`} />
                <Field label="Timestamp" value={new Date(current.timestamp).toLocaleTimeString([], { hour12: false })} suppressHydration />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Class Probabilities</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={probs}>
                    <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 1]} />
                    <Tooltip contentStyle={{ background: "#0B1120", border: "1px solid rgba(59,191,248,0.3)", borderRadius: 8 }} />
                    <Bar dataKey="p" radius={[6, 6, 0, 0]}>
                      {probs.map((entry) => (
                        <rect key={entry.name} fill={WASTE_COLORS[entry.name as WasteType]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-foreground">Top 5 Predictions</h3>
            <div className="mt-3 space-y-2">
              {top5.map((t, i) => (
                <div key={t.name} className="flex items-center gap-2 text-xs">
                  <div className="w-4 text-muted-foreground">{i + 1}</div>
                  <div className="w-20 font-semibold" style={{ color: WASTE_COLORS[t.name as WasteType] }}>{t.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div className="h-full" initial={{ width: 0 }} animate={{ width: `${t.p * 100}%` }}
                      style={{ background: WASTE_COLORS[t.name as WasteType] }} />
                  </div>
                  <div className="w-14 text-right font-mono text-foreground">{(t.p * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-foreground">Recent Predictions</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">ID</th><th>Class</th><th>Confidence</th><th>Device</th><th>Area</th><th>Weight</th><th>Inference</th><th>Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {recent.map((r) => (
                  <tr key={r.id} className="text-foreground/90">
                    <td className="py-2 font-mono text-primary">{r.id}</td>
                    <td><span className="font-semibold" style={{ color: WASTE_COLORS[r.waste] }}>{r.waste}</span></td>
                    <td className="font-mono">{(r.confidence * 100).toFixed(1)}%</td>
                    <td className="font-mono">{r.device}</td>
                    <td className="text-muted-foreground">{r.area}</td>
                    <td className="font-mono">{r.weightKg} kg</td>
                    <td className="font-mono">{r.inferenceMs}ms</td>
                    <td className="text-muted-foreground" suppressHydrationWarning>{formatTimeAgo(r.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, color, suppressHydration }: { label: string; value: string; color?: string; suppressHydration?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 px-3 py-2">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold" style={color ? { color } : undefined} suppressHydrationWarning={suppressHydration}>{value}</span>
    </div>
  );
}

function buildProbs(top: WasteType) {
  const remaining = 1 - (0.7 + Math.random() * 0.25);
  const others = WASTE_TYPES.filter((w) => w !== top);
  const noise = others.map(() => Math.random());
  const sum = noise.reduce((a, b) => a + b, 0);
  const arr = WASTE_TYPES.map((w) => ({
    name: w,
    p: w === top ? +(1 - remaining).toFixed(3) : +((noise[others.indexOf(w)] / sum) * remaining).toFixed(3),
  }));
  return arr;
}

function emojiFor(w: WasteType) {
  const m: Record<WasteType, string> = {
    Plastic: "🧴", Paper: "📄", Metal: "🥫", Organic: "🍌", Glass: "🍾", "E-Waste": "🔋", Cardboard: "📦",
  };
  return m[w];
}
