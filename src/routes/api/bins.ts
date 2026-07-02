import { createFileRoute } from "@tanstack/react-router";
import { generateBins } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/bins")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        const area = url.searchParams.get("area");
        const limit = Math.min(Number(url.searchParams.get("limit") ?? 200), 500);
        let bins = generateBins();
        if (status) bins = bins.filter((b) => b.status === status);
        if (area) bins = bins.filter((b) => b.area === area);
        return json({ count: bins.length, data: bins.slice(0, limit) });
      },
    },
  },
});