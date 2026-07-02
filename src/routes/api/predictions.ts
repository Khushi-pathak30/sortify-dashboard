import { createFileRoute } from "@tanstack/react-router";
import { generateDevices, generatePredictions } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/predictions")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const waste = url.searchParams.get("waste");
        const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 1000);
        let preds = generatePredictions(500, generateDevices());
        if (waste) preds = preds.filter((p) => p.waste === waste);
        return json({ count: preds.length, data: preds.slice(0, limit) });
      },
    },
  },
});