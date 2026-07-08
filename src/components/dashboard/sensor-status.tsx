import { Cpu, Camera, Radar, Magnet, Cog, Wifi, Cloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { sortifyApi, type Telemetry } from "@/lib/sortify-api";

export function SensorStatus() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await sortifyApi.telemetry();
        setTelemetry(data);
      } catch (err) {
        console.error("SensorStatus: failed to fetch telemetry:", err);
      }
    };
    fetchTelemetry();
    const id = setInterval(fetchTelemetry, 2500);
    return () => clearInterval(id);
  }, []);

  const sensors: { name: string; icon: LucideIcon; online: boolean; detail: string }[] = [
    { name: "ESP32", icon: Cpu, online: !!telemetry, detail: telemetry ? `MCU · ${telemetry.device}` : "Offline" },
    { name: "Camera", icon: Camera, online: !!telemetry, detail: "OV5640 · 1080p" },
    { name: "IR Sensor", icon: Radar, online: !!telemetry, detail: telemetry?.irActive ? "IR Active" : "No Signal" },
    { name: "Metal Sensor", icon: Magnet, online: !!telemetry, detail: telemetry?.metalDetected ? "Metal Detected" : "Idle" },
    { name: "Servo Motor", icon: Cog, online: !!telemetry, detail: telemetry ? `Angle: ${telemetry.servoAngle}°` : "Idle" },
    { name: "Wi-Fi", icon: Wifi, online: !!telemetry, detail: telemetry ? `${telemetry.wifiDbm} dBm` : "Offline" },
    { name: "Cloud", icon: Cloud, online: telemetry ? telemetry.cloudConnected : false, detail: telemetry?.cloudConnected ? "Connected" : "Disconnected" },
  ];

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Real-Time Sensor Status
        </h3>
        <span className="text-[11px] text-muted-foreground">{sensors.length} devices</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {sensors.map((s) => {
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