export type WasteType = "Plastic" | "Paper" | "Metal" | "Organic" | "Glass" | "E-Waste" | "Cardboard";

export const WASTE_TYPES: WasteType[] = ["Plastic","Paper","Metal","Organic","Glass","E-Waste","Cardboard"];

export const WASTE_COLORS: Record<WasteType, string> = {
  Plastic: "#3ABFF8", Paper: "#A78BFA", Metal: "#94A3B8", Organic: "#4ADE80",
  Glass: "#22D3EE", "E-Waste": "#F97316", Cardboard: "#F59E0B",
};

export const AREAS = [
  "Sector A - Conveyor","Sector B - Recycling","Sector C - Organic","Sector D - E-Waste",
  "Loading Bay 1","Loading Bay 2","North Gate","South Gate","Warehouse","Cafeteria",
  "Lab Zone","Admin Block","Parking A","Parking B","Sorting Line 1","Sorting Line 2",
  "Compactor Yard","Cold Storage","Truck Dock","Central Hub",
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(rng: () => number, arr: readonly T[]): T { return arr[Math.floor(rng() * arr.length)]!; }

export type Bin = {
  id: string; area: string; type: WasteType; fill: number; weightKg: number; capacityKg: number;
  battery: number; status: "ok" | "warn" | "full" | "offline"; lastEmptied: string;
  sensorOk: boolean; servoOk: boolean; cameraOk: boolean;
};

export function generateBins(count = 120): Bin[] {
  const rng = mulberry32(1337);
  const bins: Bin[] = [];
  for (let i = 0; i < count; i++) {
    const fill = Math.floor(rng() * 100);
    const capacityKg = 40 + Math.floor(rng() * 80);
    const weightKg = +((fill / 100) * capacityKg).toFixed(1);
    const status: Bin["status"] = rng() < 0.05 ? "offline" : fill > 90 ? "full" : fill > 70 ? "warn" : "ok";
    bins.push({
      id: `BIN-${String(i + 1).padStart(4, "0")}`, area: pick(rng, AREAS), type: pick(rng, WASTE_TYPES),
      fill, weightKg, capacityKg, battery: 20 + Math.floor(rng() * 80), status,
      lastEmptied: `${1 + Math.floor(rng() * 48)}h ago`,
      sensorOk: rng() > 0.06, servoOk: rng() > 0.05, cameraOk: rng() > 0.08,
    });
  }
  return bins;
}

export type Device = {
  id: string; area: string; firmware: string; battery: number; signal: number;
  ip: string; mac: string; temperature: number; cpu: number; memory: number; storage: number;
  uptimeHrs: number; lastSeen: string; status: "online" | "offline" | "updating";
};

export function generateDevices(count = 50): Device[] {
  const rng = mulberry32(42);
  const out: Device[] = [];
  for (let i = 0; i < count; i++) {
    const online = rng() > 0.12;
    out.push({
      id: `ESP32-${String(i + 1).padStart(3, "0")}`, area: pick(rng, AREAS),
      firmware: `v${2 + Math.floor(rng() * 2)}.${Math.floor(rng() * 9)}.${Math.floor(rng() * 20)}`,
      battery: 20 + Math.floor(rng() * 80), signal: -30 - Math.floor(rng() * 60),
      ip: `10.0.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`,
      mac: Array.from({ length: 6 }).map(() => Math.floor(rng() * 256).toString(16).padStart(2, "0")).join(":").toUpperCase(),
      temperature: 30 + Math.floor(rng() * 40), cpu: Math.floor(rng() * 100),
      memory: Math.floor(rng() * 100), storage: Math.floor(rng() * 100),
      uptimeHrs: Math.floor(rng() * 800),
      lastSeen: online ? `${Math.floor(rng() * 30)}s ago` : `${1 + Math.floor(rng() * 12)}h ago`,
      status: online ? (rng() < 0.05 ? "updating" : "online") : "offline",
    });
  }
  return out;
}

export type AlertItem = {
  id: string; message: string; device: string; area: string;
  priority: "Critical" | "High" | "Medium" | "Low"; timestamp: number; resolved: boolean;
};

const ALERT_TEMPLATES: { msg: string; p: AlertItem["priority"] }[] = [
  { msg: "Plastic bin full", p: "High" },
  { msg: "Organic bin at 92%", p: "Medium" },
  { msg: "Metal bin overflow detected", p: "Critical" },
  { msg: "Camera offline", p: "High" },
  { msg: "ESP32 offline", p: "Critical" },
  { msg: "Servo motor failure", p: "High" },
  { msg: "Wi-Fi signal lost", p: "Medium" },
  { msg: "Cloud sync disconnected", p: "High" },
  { msg: "IR sensor failure", p: "Medium" },
  { msg: "Battery low (< 20%)", p: "Low" },
  { msg: "Unauthorized device connected", p: "Critical" },
  { msg: "Bin lid open too long", p: "Low" },
  { msg: "High temperature warning", p: "High" },
  { msg: "Firmware update available", p: "Low" },
];

export function generateAlerts(count: number, devices: Device[]): AlertItem[] {
  const rng = mulberry32(99);
  const out: AlertItem[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const t = ALERT_TEMPLATES[Math.floor(rng() * ALERT_TEMPLATES.length)]!;
    const dev = devices[Math.floor(rng() * devices.length)]!;
    out.push({
      id: `ALT-${String(i + 1).padStart(4, "0")}`, message: t.msg, priority: t.p,
      device: dev.id, area: dev.area,
      timestamp: now - Math.floor(rng() * 1000 * 60 * 60 * 24 * 3), resolved: rng() < 0.35,
    });
  }
  return out.sort((a, b) => b.timestamp - a.timestamp);
}

export type Prediction = {
  id: string; waste: WasteType; confidence: number; device: string; area: string;
  weightKg: number; timestamp: number; inferenceMs: number;
};

export function generatePredictions(count: number, devices: Device[]): Prediction[] {
  const rng = mulberry32(7);
  const out: Prediction[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const dev = devices[Math.floor(rng() * devices.length)]!;
    out.push({
      id: `PRD-${String(i + 1).padStart(5, "0")}`,
      waste: WASTE_TYPES[Math.floor(rng() * WASTE_TYPES.length)]!,
      confidence: +(0.7 + rng() * 0.3).toFixed(3),
      device: dev.id, area: dev.area,
      weightKg: +(0.02 + rng() * 1.8).toFixed(2),
      timestamp: now - Math.floor(rng() * 1000 * 60 * 60 * 24),
      inferenceMs: Math.floor(30 + rng() * 220),
    });
  }
  return out.sort((a, b) => b.timestamp - a.timestamp);
}

export type User = {
  id: string; name: string; email: string;
  role: "Admin" | "Operator" | "Supervisor" | "Maintenance";
  lastLogin: string; active: boolean;
};

export const USERS: User[] = [
  { id: "U-001", name: "Arjun Mehra", email: "arjun@sortify.ai", role: "Admin", lastLogin: "2m ago", active: true },
  { id: "U-002", name: "Priya Sharma", email: "priya@sortify.ai", role: "Supervisor", lastLogin: "18m ago", active: true },
  { id: "U-003", name: "Rohan Verma", email: "rohan@sortify.ai", role: "Operator", lastLogin: "1h ago", active: true },
  { id: "U-004", name: "Kavya Nair", email: "kavya@sortify.ai", role: "Operator", lastLogin: "3h ago", active: true },
  { id: "U-005", name: "Vikram Iyer", email: "vikram@sortify.ai", role: "Maintenance", lastLogin: "yesterday", active: true },
  { id: "U-006", name: "Sneha Rao", email: "sneha@sortify.ai", role: "Supervisor", lastLogin: "4h ago", active: false },
  { id: "U-007", name: "Aditya Kumar", email: "aditya@sortify.ai", role: "Maintenance", lastLogin: "5d ago", active: true },
  { id: "U-008", name: "Meera Joshi", email: "meera@sortify.ai", role: "Admin", lastLogin: "just now", active: true },
];

export function generateHistory(days = 365) {
  const rng = mulberry32(2025);
  const out: { date: string; total: number; perType: Record<WasteType, number> }[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const perType = {} as Record<WasteType, number>;
    let total = 0;
    for (const w of WASTE_TYPES) {
      const v = Math.floor(20 + rng() * 120);
      perType[w] = v; total += v;
    }
    out.push({ date: d.toISOString().slice(0, 10), total, perType });
  }
  return out;
}

export function formatTimeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
