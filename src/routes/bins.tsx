import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2, Battery, Wifi, Search, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { generateBins, AREAS, WASTE_TYPES, type Bin } from "@/lib/mock";

export const Route = createFileRoute("/bins")({
  component: Page,
  head: () => ({ meta: [{ title: "Bin Management — SORTIFY AI" }] }),
});

const STATUS_COLOR: Record<Bin["status"], string> = {
  ok: "bg-success/15 text-success border-success/30",
  warn: "bg-warning/15 text-warning border-warning/30",
  full: "bg-danger/15 text-danger border-danger/30",
  offline: "bg-muted text-muted-foreground border-border",
};

const FILL_COLOR = (f: number) =>
  f > 90 ? "bg-danger" : f > 75 ? "bg-orange-400" : f > 50 ? "bg-warning" : "bg-success";

function Page() {
  const bins = useMemo(() => generateBins(120), []);
  const [area, setArea] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Bin | null>(null);

  const filtered = bins.filter(
    (b) =>
      (area === "all" || b.area === area) &&
      (type === "all" || b.type === type) &&
      (status === "all" || b.status === status) &&
      (q === "" || b.id.toLowerCase().includes(q.toLowerCase()) || b.area.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Bin <span className="text-primary text-glow-cyan">Management</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {bins.length} smart bins across {AREAS.length} zones.
            </p>
          </div>
        </div>

        <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search bin ID or area…"
              className="w-full rounded-xl border border-primary/10 bg-primary/5 py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary/40 focus:outline-none"
            />
          </div>
          <Select label="Area" value={area} onChange={setArea} options={["all", ...AREAS]} />
          <Select label="Type" value={type} onChange={setType} options={["all", ...WASTE_TYPES]} />
          <Select label="Status" value={status} onChange={setStatus} options={["all", "ok", "warn", "full", "offline"]} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b)}
              className="glass group rounded-2xl p-4 text-left transition hover:border-primary/40 hover:glow-cyan"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-semibold text-foreground">{b.id}</div>
                    <div className="text-[11px] text-muted-foreground">{b.area}</div>
                  </div>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLOR[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{b.type}</span>
                <span className="font-mono text-foreground">{b.weightKg} / {b.capacityKg} kg</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${FILL_COLOR(b.fill)} transition-all`} style={{ width: `${b.fill}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Fill: <span className="font-mono text-foreground">{b.fill}%</span></span>
                <span className="flex items-center gap-1"><Battery className="h-3 w-3" />{b.battery}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <BinModal bin={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-1.5 text-sm text-foreground focus:border-primary/40 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === "all" ? "All" : o}</option>
        ))}
      </select>
    </label>
  );
}

function BinModal({ bin, onClose }: { bin: Bin; onClose: () => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-lg font-bold text-primary">{bin.id}</div>
            <div className="text-sm text-muted-foreground">{bin.area} · {bin.type}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Fill Level" value={`${bin.fill}%`} />
          <Info label="Weight" value={`${bin.weightKg} kg`} />
          <Info label="Capacity" value={`${bin.capacityKg} kg`} />
          <Info label="Battery" value={`${bin.battery}%`} />
          <Info label="Status" value={bin.status} />
          <Info label="Last Emptied" value={bin.lastEmptied} />
          <Info label="Collection Due" value={bin.fill > 80 ? "Now" : `${Math.max(1, Math.floor((90 - bin.fill) / 5))}h`} />
          <Info label="Sensors" value={<span className="flex gap-1"><Dot ok={bin.sensorOk} />IR<Dot ok={bin.servoOk} />Servo<Dot ok={bin.cameraOk} />Cam</span>} />
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Schedule Collection</button>
          <button className="flex-1 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-semibold text-foreground hover:bg-primary/10">Mark Emptied</button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-success" : "bg-danger"} mx-1`} />;
}
