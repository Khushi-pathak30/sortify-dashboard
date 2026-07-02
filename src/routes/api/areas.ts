import { createFileRoute } from "@tanstack/react-router";
import { AREAS } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/areas")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async () => json({ count: AREAS.length, data: AREAS }),
    },
  },
});