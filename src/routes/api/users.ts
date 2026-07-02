import { createFileRoute } from "@tanstack/react-router";
import { USERS } from "@/lib/mock";
import { json, optionsHandler } from "./_cors";

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      OPTIONS: optionsHandler,
      GET: async () => json({ count: USERS.length, data: USERS }),
    },
  },
});