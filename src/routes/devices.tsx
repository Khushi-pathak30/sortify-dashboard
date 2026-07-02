import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useMemo, useState } from "react";
import { generateDevices, AREAS, type Device } from "@/lib/mock";
import { RefreshCw, Download, Power, RotateCw, Search, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/devices")({
  component: Page,
  head: () => ({ meta: [{ title: "Device Management — SORTIFY AI" }] }),
});

const STATUS: Record<Device["status"], string> = {
  online: "border-success/30 bg-success/10 text-success",
  offline: "border-danger/30 bg-danger/10 text-danger",
  updating: "border-warning/30 bg-warning/10 text-warning",
};

function Page() {
  const seed = useMemo(() => generateDevices(50), []);
  const [devices, setDevices] = useState(seed);
  const [q, setQ] = useState("");
  const [area, setArea] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Device | null>(null);

  const filtered = devices.filter(
    (d) =>
      (area === "all" || d.area === area) &&
      (status === "all" || d.status === status) &&
      (q === "" || d.id.toLowerCase().includes(q.toLowerCase()) || d.ip.includes(q)),
  );

  const act = (kind: string, id: string) => toast.success(`${kind} sent to ${id}`);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Device <span className="text-primary text-glow-cyan">Fleet</span>
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} of {devices.length} ESP32 nodes.</p>
          </div>
        </div>

        <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID or IP…"
              className="w-full rounded-xl border border-primary/10 bg-primary/5 py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
          </div>
          <Sel label="Area" value={area} onChange={setArea} options={["all", ...AREAS]} />
          <Sel label="Status" value={status} onChange={setStatus} options={["all", "online", "offline", "updating"]} />
        </div>

        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-xs">
            <thead className="border-b border-primary/10 text-muted-foreground">
              <tr className="text-left">
                <th className="px-3 py-2.5">Device</th><th>Area</th><th>Firmware</th><th>Battery</th><th>Signal</th>
                <th>IP</th><th>CPU</th><th>Mem</th><th>Temp</th><th>Uptime</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {filtered.map((d) => (
                <tr key={d.id} className="text-foreground/90 hover:bg-primary/5">
                  <td className="px-3 py-2.5 font-mono text-primary">{d.id}</td>
                  <td className="text-muted-foreground">{d.area}</td>
                  <td className="font-mono">{d.firmware}</td>
                  <td className="font-mono">{d.battery}%</td>
                  <td className="font-mono">{d.signal} dBm</td>
                  <td className="font-mono">{d.ip}</td>
                  <td className="font-mono">{d.cpu}%</td>
                  <td className="font-mono">{d.memory}%</td>
                  <td className="font-mono">{d.temperature}°C</td>
                  <td className="font-mono">{d.uptimeHrs}h</td>
                  <td><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS[d.status]}`}>{d.status}</span></td>
                  <td>
                    <button onClick={() => setSelected(d)}
                      className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] hover:bg-primary/10">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
          <div onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-xl rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-lg font-bold text-primary">{selected.id}</div>
                <div className="text-sm text-muted-foreground">{selected.area} · {selected.firmware}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <Info label="IP" value={selected.ip} />
              <Info label="MAC" value={selected.mac} />
              <Info label="Battery" value={`${selected.battery}%`} />
              <Info label="Signal" value={`${selected.signal} dBm`} />
              <Info label="CPU" value={`${selected.cpu}%`} />
              <Info label="Memory" value={`${selected.memory}%`} />
              <Info label="Storage" value={`${selected.storage}%`} />
              <Info label="Temperature" value={`${selected.temperature}°C`} />
              <Info label="Uptime" value={`${selected.uptimeHrs}h`} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ActBtn icon={<RotateCw className="h-3.5 w-3.5" />} label="Restart" onClick={() => act("Restart", selected.id)} />
              <ActBtn icon={<Download className="h-3.5 w-3.5" />} label="Update FW" onClick={() => act("Firmware update", selected.id)} />
              <ActBtn icon={<Power className="h-3.5 w-3.5" />} label="Disconnect" onClick={() => act("Disconnect", selected.id)} />
              <ActBtn icon={<RefreshCw className="h-3.5 w-3.5" />} label="Reconnect" onClick={() => act("Reconnect", selected.id)} />
            </div>
            <div className="mt-4 rounded-xl border border-primary/10 bg-black/40 p-3 font-mono text-[11px] text-primary/80">
              <div>[boot] SORTIFY firmware {selected.firmware}</div>
              <div>[wifi] connected, rssi {selected.signal} dBm</div>
              <div>[cam] init OK, 1080p @30fps</div>
              <div>[mqtt] broker sortify-cloud.internal:8883 subscribed</div>
              <div>[ai] Edge Impulse model v2.3.1 loaded ({selected.memory}% mem)</div>
              <div>[loop] tick +{selected.uptimeHrs * 3600}s uptime</div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ActBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-2 py-2 text-xs font-semibold text-foreground hover:bg-primary/10">
      {icon}{label}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold text-foreground truncate">{value}</div>
    </div>
  );
}

function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-wider">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-primary/10 bg-primary/5 px-2 py-1.5 text-sm text-foreground focus:border-primary/40 focus:outline-none">
        {options.map((o) => <option key={o} value={o}>{o === "all" ? "All" : o}</option>)}
      </select>
    </label>
  );
}
