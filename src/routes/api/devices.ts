import { createFileRoute } from "@tanstack/react-router";
import { generateDevices } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/devices")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        let devices = generateDevices();
        if (status) devices = devices.filter((d) => d.status === status);
        return json({ count: devices.length, data: devices });
      },
    },
  },
});