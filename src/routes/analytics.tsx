import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMemo, useState } from "react";
import { generateHistory, WASTE_TYPES, WASTE_COLORS, AREAS, type WasteType } from "@/lib/mock";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/analytics")({
  component: Page,
  head: () => ({ meta: [{ title: "Analytics — SORTIFY AI" }] }),
});

const RANGES = ["Today", "Week", "Month", "Year"] as const;

function Page() {
  const history = useMemo(() => generateHistory(365), []);
  const [range, setRange] = useState<(typeof RANGES)[number]>("Week");

  const sliced = useMemo(() => {
    const n = range === "Today" ? 1 : range === "Week" ? 7 : range === "Month" ? 30 : 365;
    return history.slice(-n);
  }, [history, range]);

  const perType = useMemo(() => {
    const out = WASTE_TYPES.map((w) => ({ name: w, value: sliced.reduce((a, d) => a + d.perType[w], 0) }));
    return out;
  }, [sliced]);

  const daily = sliced.map((d) => ({ date: d.date.slice(5), total: d.total }));

  const perArea = useMemo(() => {
    return AREAS.map((a, i) => ({ name: a.replace("Sector ", "").slice(0, 12), value: 40 + ((i * 173) % 400) })).slice(0, 12);
  }, []);

  const hourly = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => ({ hour: `${h}:00`, detections: 20 + Math.floor(Math.sin(h / 3) * 30 + Math.random() * 30) })), []);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Waste <span className="text-primary text-glow-cyan">Analytics</span>
            </h1>
            <p className="text-sm text-muted-foreground">{sliced.length} days of collection data.</p>
          </div>
          <div className="flex gap-1 rounded-full border border-primary/20 bg-primary/5 p-1">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Waste by Category" className="lg:col-span-1">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={perType} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {perType.map((e) => <Cell key={e.name} fill={WASTE_COLORS[e.name as WasteType]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0B1120", border: "1px solid rgba(59,191,248,0.3)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
              {perType.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: WASTE_COLORS[p.name as WasteType] }} />
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className="ml-auto font-mono text-foreground">{p.value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Daily Collection Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ABFF8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3ABFF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0B1120", border: "1px solid rgba(59,191,248,0.3)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="total" stroke="#3ABFF8" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Area-wise Waste (kg)" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={perArea}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0B1120", border: "1px solid rgba(59,191,248,0.3)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#A78BFA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Hourly Detection Heatmap" className="lg:col-span-1">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={hourly}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fill: "#94A3B8", fontSize: 10 }} interval={2} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0B1120", border: "1px solid rgba(59,191,248,0.3)", borderRadius: 8 }} />
                <Line dataKey="detections" stroke="#4ADE80" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel title="Category Breakdown by Day">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sliced.slice(-14).map((d) => ({ date: d.date.slice(5), ...d.perType }))} stackOffset="expand">
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0B1120", border: "1px solid rgba(59,191,248,0.3)", borderRadius: 8 }} />
              {WASTE_TYPES.map((w) => (
                <Bar key={w} dataKey={w} stackId="a" fill={WASTE_COLORS[w]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </AppShell>
  );
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 ${className ?? ""}`}>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
