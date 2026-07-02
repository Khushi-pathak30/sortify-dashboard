import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMemo, useState } from "react";
import { generateHistory, WASTE_TYPES, AREAS } from "@/lib/mock";
import { FileDown, FileSpreadsheet, Printer, Share2, Weight, Recycle, MapPin, Percent } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: Page,
  head: () => ({ meta: [{ title: "Reports — SORTIFY AI" }] }),
});

function Page() {
  const history = useMemo(() => generateHistory(365), []);
  const [range, setRange] = useState("Month");

  const today = history[history.length - 1]!;
  const week = history.slice(-7).reduce((a, d) => a + d.total, 0);
  const month = history.slice(-30).reduce((a, d) => a + d.total, 0);
  const year = history.reduce((a, d) => a + d.total, 0);

  const areaData = useMemo(() =>
    AREAS.map((a, i) => ({
      area: a,
      total: 200 + ((i * 137) % 900),
      plastic: 50 + ((i * 23) % 200),
      organic: 40 + ((i * 41) % 300),
      recycled: 30 + ((i * 61) % 200),
    })).sort((a, b) => b.total - a.total), []);

  const cleanest = [...areaData].sort((a, b) => a.total - b.total)[0]!;
  const dirtiest = areaData[0]!;
  const mostPlastic = [...areaData].sort((a, b) => b.plastic - a.plastic)[0]!;
  const mostOrganic = [...areaData].sort((a, b) => b.organic - a.organic)[0]!;
  const bestRecycled = [...areaData].sort((a, b) => b.recycled - a.recycled)[0]!;

  const doExport = (kind: string) => toast.success(`${kind} exported`, { description: "Report generated with current filters." });

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Compliance <span className="text-primary text-glow-cyan">Reports</span>
            </h1>
            <p className="text-sm text-muted-foreground">Aggregated collection performance across all zones.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => doExport("PDF")} className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"><FileDown className="h-4 w-4" />Export PDF</button>
            <button onClick={() => doExport("Excel")} className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-xs font-semibold text-success hover:bg-success/20"><FileSpreadsheet className="h-4 w-4" />Export Excel</button>
            <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary/10"><Printer className="h-4 w-4" />Print</button>
            <button onClick={() => doExport("Share link")} className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary/10"><Share2 className="h-4 w-4" />Share</button>
          </div>
        </div>

        <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 text-xs">
          <span className="uppercase tracking-widest text-muted-foreground">Filters:</span>
          <Sel label="Range" value={range} onChange={setRange} options={["Today", "Week", "Month", "Year"]} />
          <Sel label="Area" value="all" onChange={() => {}} options={["all", ...AREAS]} />
          <Sel label="Type" value="all" onChange={() => {}} options={["all", ...WASTE_TYPES]} />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kpi icon={<Weight />} label="Today" value={`${today.total} kg`} />
          <Kpi icon={<Weight />} label="This Week" value={`${week} kg`} />
          <Kpi icon={<Weight />} label="This Month" value={`${(month / 1000).toFixed(1)} t`} />
          <Kpi icon={<Weight />} label="This Year" value={`${(year / 1000).toFixed(1)} t`} />
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Highlight icon={<MapPin />} label="Most Polluted" value={dirtiest.area} sub={`${dirtiest.total} kg`} tone="danger" />
          <Highlight icon={<Recycle />} label="Cleanest Area" value={cleanest.area} sub={`${cleanest.total} kg`} tone="success" />
          <Highlight icon={<MapPin />} label="Most Plastic" value={mostPlastic.area} sub={`${mostPlastic.plastic} kg`} tone="primary" />
          <Highlight icon={<MapPin />} label="Most Organic" value={mostOrganic.area} sub={`${mostOrganic.organic} kg`} tone="warning" />
          <Highlight icon={<Percent />} label="Best Recycling" value={bestRecycled.area} sub={`${bestRecycled.recycled} kg`} tone="accent" />
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Area-wise Collection</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">Area</th><th>Total (kg)</th><th>Plastic</th><th>Organic</th><th>Recycled</th><th>Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {areaData.map((a) => (
                  <tr key={a.area} className="text-foreground/90">
                    <td className="py-2">{a.area}</td>
                    <td className="font-mono">{a.total}</td>
                    <td className="font-mono">{a.plastic}</td>
                    <td className="font-mono">{a.organic}</td>
                    <td className="font-mono">{a.recycled}</td>
                    <td className="font-mono text-success">{Math.round((a.recycled / a.total) * 100)}%</td>
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

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>{label}
      </div>
      <div className="mt-1 font-mono text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function Highlight({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: string }) {
  const map: Record<string, string> = {
    danger: "border-danger/30 bg-danger/10 text-danger",
    success: "border-success/30 bg-success/10 text-success",
    primary: "border-primary/30 bg-primary/10 text-primary",
    warning: "border-warning/30 bg-warning/10 text-warning",
    accent: "border-accent/30 bg-accent/10 text-accent",
  };
  return (
    <div className="glass rounded-2xl p-4">
      <div className={`inline-flex rounded-lg border p-2 ${map[tone]}`}>{icon}</div>
      <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-1.5 text-muted-foreground">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-1 text-foreground">
        {options.map((o) => <option key={o} value={o}>{o === "all" ? "All" : o}</option>)}
      </select>
    </label>
  );
}
