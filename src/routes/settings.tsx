import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { toast } from "sonner";
import { Save, KeyRound, Cloud, Bell, Brain, Cpu, Shield, Palette } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: Page,
  head: () => ({ meta: [{ title: "Settings — SORTIFY AI" }] }),
});

function Page() {
  const [state, setState] = useState({
    org: "SORTIFY AI Industries",
    theme: "Dark",
    lang: "English",
    tz: "UTC+05:30",
    dateFmt: "DD MMM YYYY",
    email: true,
    sms: false,
    push: true,
    binCap: 80,
    critFill: 90,
    conf: 0.85,
    autoClass: true,
    resolution: "1080p",
    fps: 30,
    api: "https://api.sortify.ai/v2",
    db: "postgres://prod-cluster",
    mqtt: "mqtts://broker.sortify.ai:8883",
    aws: "iot.us-east-1.amazonaws.com",
    backup: "Daily 02:00 UTC",
    sessionMin: 30,
  });
  const set = (k: keyof typeof state, v: unknown) => setState((s) => ({ ...s, [k]: v as never }));
  const save = () => toast.success("Settings saved", { description: "Configuration synced to all edge devices." });

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              System <span className="text-primary text-glow-cyan">Settings</span>
            </h1>
            <p className="text-sm text-muted-foreground">Configure organization, AI, cloud and security policies.</p>
          </div>
          <button onClick={save} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-cyan hover:opacity-90">
            <Save className="h-4 w-4" />Save changes
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Section icon={<Palette />} title="General">
            <Row label="Organization">
              <input value={state.org} onChange={(e) => set("org", e.target.value)} className={inp} />
            </Row>
            <Row label="Theme"><SelectBox value={state.theme} onChange={(v) => set("theme", v)} options={["Dark", "Light", "Auto"]} /></Row>
            <Row label="Language"><SelectBox value={state.lang} onChange={(v) => set("lang", v)} options={["English", "Hindi", "Spanish", "German"]} /></Row>
            <Row label="Timezone"><SelectBox value={state.tz} onChange={(v) => set("tz", v)} options={["UTC", "UTC+05:30", "UTC+01:00", "UTC-05:00"]} /></Row>
            <Row label="Date format"><SelectBox value={state.dateFmt} onChange={(v) => set("dateFmt", v)} options={["DD MMM YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]} /></Row>
          </Section>

          <Section icon={<Bell />} title="Notifications">
            <Toggle label="Email alerts" value={state.email} onChange={(v) => set("email", v)} />
            <Toggle label="SMS alerts" value={state.sms} onChange={(v) => set("sms", v)} />
            <Toggle label="Push notifications" value={state.push} onChange={(v) => set("push", v)} />
            <Row label={`Bin capacity threshold (${state.binCap}%)`}>
              <input type="range" min={40} max={100} value={state.binCap} onChange={(e) => set("binCap", +e.target.value)} className="w-full accent-primary" />
            </Row>
            <Row label={`Critical fill level (${state.critFill}%)`}>
              <input type="range" min={60} max={100} value={state.critFill} onChange={(e) => set("critFill", +e.target.value)} className="w-full accent-primary" />
            </Row>
          </Section>

          <Section icon={<Brain />} title="AI Model">
            <Row label={`Confidence threshold (${(state.conf * 100).toFixed(0)}%)`}>
              <input type="range" min={0.5} max={0.99} step={0.01} value={state.conf} onChange={(e) => set("conf", +e.target.value)} className="w-full accent-primary" />
            </Row>
            <Toggle label="Auto-classification" value={state.autoClass} onChange={(v) => set("autoClass", v)} />
            <Row label="Image resolution"><SelectBox value={state.resolution} onChange={(v) => set("resolution", v)} options={["720p", "1080p", "4K"]} /></Row>
            <Row label={`Camera FPS (${state.fps})`}>
              <input type="range" min={10} max={60} value={state.fps} onChange={(e) => set("fps", +e.target.value)} className="w-full accent-primary" />
            </Row>
          </Section>

          <Section icon={<Cloud />} title="Cloud & Integration">
            <Row label="API endpoint"><input value={state.api} onChange={(e) => set("api", e.target.value)} className={inp} /></Row>
            <Row label="Database"><input value={state.db} onChange={(e) => set("db", e.target.value)} className={inp} /></Row>
            <Row label="MQTT broker"><input value={state.mqtt} onChange={(e) => set("mqtt", e.target.value)} className={inp} /></Row>
            <Row label="AWS IoT endpoint"><input value={state.aws} onChange={(e) => set("aws", e.target.value)} className={inp} /></Row>
            <Row label="Backup schedule"><SelectBox value={state.backup} onChange={(v) => set("backup", v)} options={["Hourly", "Daily 02:00 UTC", "Weekly Sunday"]} /></Row>
          </Section>

          <Section icon={<Cpu />} title="Device Operations">
            <ActionRow label="Restart all devices" btn="Restart" onClick={() => toast.success("Fleet restart initiated")} />
            <ActionRow label="Push firmware update" btn="Deploy" onClick={() => toast.success("Firmware v2.3.2 queued for 50 devices")} />
            <ActionRow label="Calibrate sensors" btn="Calibrate" onClick={() => toast.success("Calibration scheduled")} />
          </Section>

          <Section icon={<Shield />} title="Security">
            <ActionRow label="Change password" btn="Update" onClick={() => toast.success("Password change email sent")} />
            <ActionRow label="Role management" btn="Configure" onClick={() => toast("Opening role editor…")} />
            <ActionRow label="API keys" btn={<><KeyRound className="h-3 w-3" /> Rotate</>} onClick={() => toast.success("New API key generated")} />
            <Row label={`Session timeout (${state.sessionMin} min)`}>
              <input type="range" min={5} max={120} value={state.sessionMin} onChange={(e) => set("sessionMin", +e.target.value)} className="w-full accent-primary" />
            </Row>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}

const inp = "w-full rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-sm text-foreground focus:border-primary/40 focus:outline-none font-mono";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function SelectBox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-primary/10 bg-primary/5 px-3 py-2 text-sm text-foreground focus:border-primary/40 focus:outline-none">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 px-3 py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition ${value ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${value ? "left-4.5 translate-x-4" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function ActionRow({ label, btn, onClick }: { label: string; btn: React.ReactNode; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 px-3 py-2">
      <span className="text-sm text-foreground">{label}</span>
      <button onClick={onClick} className="flex items-center gap-1 rounded-lg bg-primary/15 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/25">{btn}</button>
    </div>
  );
}
