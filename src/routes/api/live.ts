import { createFileRoute } from "@tanstack/react-router";
import { AREAS, WASTE_TYPES, generateDevices } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/live")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
        const devices = generateDevices();
        const now = Date.now();
        const events = Array.from({ length: limit }).map((_, i) => {
          const d = devices[Math.floor(Math.random() * devices.length)]!;
          return {
            id: `EVT-${now}-${i}`,
            timestamp: now - i * 1500,
            device: d.id,
            area: d.area ?? AREAS[i % AREAS.length],
            waste: WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)],
            confidence: +(0.7 + Math.random() * 0.3).toFixed(3),
            weightKg: +(0.05 + Math.random() * 1.5).toFixed(2),
            inferenceMs: Math.floor(30 + Math.random() * 200),
          };
        });
        return json({ count: events.length, data: events, generatedAt: now });
      },
    },
  },
});