// Sortify backend API client — reads base URL from VITE_SORTIFY_API_URL.
// Falls back to http://localhost:8000 (dev).
export const SORTIFY_API_URL =
  (import.meta.env.VITE_SORTIFY_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000";

export type LiveEvent = {
  id: string;
  timestamp: number;
  device: string;
  bin: string;
  area: string;
  waste: string;
  confidence: number;
  weightKg: number;
  inferenceMs: number;
  frameId: number;
};

export type Telemetry = {
  device: string;
  timestamp: number;
  distanceCm: number;
  metalDetected: boolean;
  irActive: boolean;
  servoAngle: number;
  wifiDbm: number;
  cloudConnected: boolean;
  objectsInFrame: number;
  avgProcessingMs: number;
};

export type SensorComponent = {
  name: string;
  type: string;
  online: boolean;
  detail: string;
  value: string | number | null;
};

export type SensorsResponse = {
  device: string;
  timestamp: number;
  components: SensorComponent[];
};

export type LiveSummary = {
  streaming: boolean;
  connectedDevices: number;
  eventsPerMinute: number;
  lastPrediction: {
    waste: string;
    confidence: number;
    inferenceMs: number;
    frameId: number;
  } | null;
  avgProcessingMs: number;
  modelVersion: string;
};

export type CameraMeta = {
  cameraId: string;
  resolution: string;
  fps: number;
  latencyMs: number;
  frameId: number;
  timestamp: string;
  streamUrl: string;
  model: string;
  detections: Array<{
    id: string;
    waste: string;
    confidence: number;
    bbox: { x: number; y: number; w: number; h: number };
    inferenceMs: number;
  }>;
};

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SORTIFY_API_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sortify API ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const sortifyApi = {
  events: (since?: number, limit = 20) =>
    get<{ count: number; generatedAt: number; data: LiveEvent[] }>(
      `/api/live/events?limit=${limit}${since ? `&since=${since}` : ""}`,
    ),
  telemetry: (device?: string) =>
    get<Telemetry>(`/api/live/telemetry${device ? `?device=${device}` : ""}`),
  sensors: (device?: string) =>
    get<SensorsResponse>(`/api/live/sensors${device ? `?device=${device}` : ""}`),
  summary: () => get<LiveSummary>(`/api/live/summary`),
  camera: (cameraId: string) => get<CameraMeta>(`/api/live/camera/${cameraId}`),
  streamUrl: () => `${SORTIFY_API_URL}/api/live/stream`,
};