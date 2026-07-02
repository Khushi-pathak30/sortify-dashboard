import { Cpu, Camera, Radar, Magnet, Cog, Wifi, Cloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SENSORS: { name: string; icon: LucideIcon; online: boolean; detail: string }[] = [
  { name: "ESP32", icon: Cpu, online: true, detail: "MCU · 240 MHz" },
  { name: "Camera", icon: Camera, online: true, detail: "OV5640 · 1080p" },
  { name: "IR Sensor", icon: Radar, online: true, detail: "TCRT5000" },
  { name: "Metal Sensor", icon: Magnet, online: true, detail: "LDC1000" },
  { name: "Servo Motor", icon: Cog, online: true, detail: "MG996R · 180°" },
  { name: "Wi-Fi", icon: Wifi, online: true, detail: "−52 dBm" },
  { name: "Cloud", icon: Cloud, online: false, detail: "Reconnecting…" },
];

export function SensorStatus() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Real-Time Sensor Status
        </h3>
        <span className="text-[11px] text-muted-foreground">7 devices</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {SENSORS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className={`relative overflow-hidden rounded-xl border p-3 transition ${
                s.online
                  ? "border-success/25 bg-success/5 hover:border-success/50"
                  : "border-danger/30 bg-danger/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`grid h-8 w-8 place-items-center rounded-lg ${
                    s.online ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-foreground">{s.name}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{s.detail}</div>
                </div>
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    s.online ? "bg-success pulse-dot" : "bg-danger"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}