import { createFileRoute } from "@tanstack/react-router";
import { generateHistory } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/history")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const days = Math.min(Number(url.searchParams.get("days") ?? 30), 365);
        const history = generateHistory(365).slice(-days);
        return json({ count: history.length, data: history });
      },
    },
  },
});