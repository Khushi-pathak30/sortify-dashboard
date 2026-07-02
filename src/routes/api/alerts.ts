import { createFileRoute } from "@tanstack/react-router";
import { generateAlerts, generateDevices } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/alerts")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const priority = url.searchParams.get("priority");
        const resolved = url.searchParams.get("resolved");
        const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);
        let alerts = generateAlerts(100, generateDevices());
        if (priority) alerts = alerts.filter((a) => a.priority === priority);
        if (resolved != null) alerts = alerts.filter((a) => String(a.resolved) === resolved);
        return json({ count: alerts.length, data: alerts.slice(0, limit) });
      },
    },
  },
});