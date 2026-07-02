import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMemo, useState } from "react";
import { generateAlerts, generateDevices, formatTimeAgo, type AlertItem } from "@/lib/mock";
import { BellRing, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/alerts")({
  component: Page,
  head: () => ({ meta: [{ title: "Alerts — SORTIFY AI" }] }),
});

const PRIO: Record<AlertItem["priority"], string> = {
  Critical: "border-danger/40 bg-danger/15 text-danger",
  High: "border-orange-500/40 bg-orange-500/15 text-orange-400",
  Medium: "border-warning/40 bg-warning/15 text-warning",
  Low: "border-primary/30 bg-primary/10 text-primary",
};

function Page() {
  const devices = useMemo(() => generateDevices(50), []);
  const seed = useMemo(() => generateAlerts(100, devices), [devices]);
  const [alerts, setAlerts] = useState(seed);
  const [prio, setPrio] = useState<"all" | AlertItem["priority"]>("all");
  const [showResolved, setShowResolved] = useState(true);

  const resolve = (id: string) => {
    setAlerts((a) => a.map((x) => (x.id === id ? { ...x, resolved: true } : x)));
    toast.success("Alert resolved");
  };

  const filtered = alerts.filter((a) => (prio === "all" || a.priority === prio) && (showResolved || !a.resolved));
  const counts = {
    Critical: alerts.filter((a) => a.priority === "Critical" && !a.resolved).length,
    High: alerts.filter((a) => a.priority === "High" && !a.resolved).length,
    Medium: alerts.filter((a) => a.priority === "Medium" && !a.resolved).length,
    Low: alerts.filter((a) => a.priority === "Low" && !a.resolved).length,
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              System <span className="text-primary text-glow-cyan">Alerts</span>
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} alerts · {counts.Critical} critical open</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} />
            Show resolved
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(Object.keys(counts) as (keyof typeof counts)[]).map((k) => (
            <button key={k} onClick={() => setPrio(prio === k ? "all" : k)}
              className={`glass rounded-2xl p-4 text-left transition ${prio === k ? "border-primary/40 glow-cyan" : ""}`}>
              <div className={`inline-flex rounded-lg border px-2 py-1 text-[10px] font-bold uppercase ${PRIO[k]}`}>{k}</div>
              <div className="mt-2 font-mono text-3xl font-bold text-foreground">{counts[k]}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="divide-y divide-primary/10">
            {filtered.map((a) => (
              <div key={a.id} className={`grid grid-cols-1 gap-2 py-3 md:grid-cols-[auto_1fr_auto_auto_auto] md:items-center ${a.resolved ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl border ${PRIO[a.priority]}`}>
                    <BellRing className="h-4 w-4" />
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${PRIO[a.priority]}`}>{a.priority}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{a.message}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{a.id} · {a.device} · {a.area}</div>
                </div>
                <div className="text-[11px] text-muted-foreground" suppressHydrationWarning>{formatTimeAgo(a.timestamp)}</div>
                <div>
                  {a.resolved
                    ? <span className="text-[11px] font-semibold text-success">RESOLVED</span>
                    : <span className="text-[11px] font-semibold text-warning">OPEN</span>}
                </div>
                <div>
                  {!a.resolved && (
                    <button onClick={() => resolve(a.id)}
                      className="flex items-center gap-1 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/25">
                      <Check className="h-3 w-3" />Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
