import { AlertTriangle, Wifi, CameraOff, Battery, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Level = "warning" | "danger" | "success" | "info";

const ALERTS: {
  title: string;
  time: string;
  level: Level;
  icon: LucideIcon;
  detail: string;
}[] = [
  { title: "Plastic Bin Full", time: "2 min ago", level: "warning", icon: Trash2, detail: "Bin #02 at 94% capacity" },
  { title: "Metal Detected", time: "5 min ago", level: "info", icon: AlertTriangle, detail: "Inductive sensor triggered" },
  { title: "Camera Offline", time: "12 min ago", level: "danger", icon: CameraOff, detail: "CAM-02 lost signal" },
  { title: "Wi-Fi Reconnected", time: "22 min ago", level: "success", icon: Wifi, detail: "Uptime restored" },
  { title: "Low Battery", time: "1 hr ago", level: "warning", icon: Battery, detail: "Backup pack at 18%" },
];

const LEVEL: Record<Level, { border: string; bg: string; text: string; badge: string }> = {
  warning: { border: "border-warning/30", bg: "bg-warning/10", text: "text-warning", badge: "bg-warning/15" },
  danger: { border: "border-danger/30", bg: "bg-danger/10", text: "text-danger", badge: "bg-danger/15" },
  success: { border: "border-success/30", bg: "bg-success/10", text: "text-success", badge: "bg-success/15" },
  info: { border: "border-primary/30", bg: "bg-primary/10", text: "text-primary", badge: "bg-primary/15" },
};

export function AlertsPanel() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Recent Alerts
        </h3>
        <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-danger">
          {ALERTS.length} active
        </span>
      </div>
      <div className="space-y-2.5">
        {ALERTS.map((a) => {
          const s = LEVEL[a.level];
          const Icon = a.icon;
          return (
            <div
              key={a.title}
              className={`flex items-center gap-3 rounded-xl border ${s.border} ${s.bg} p-3`}
            >
              <div className={`grid h-9 w-9 place-items-center rounded-lg ${s.badge} ${s.text}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">{a.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${s.badge} ${s.text}`}
                  >
                    {a.level}
                  </span>
                </div>
                <div className="truncate text-[11px] text-muted-foreground">{a.detail}</div>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}