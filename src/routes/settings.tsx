import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/settings")({
  component: Page,
  head: () => ({ meta: [{ title: "Settings — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Settings"
        subtitle="System configuration, users and integrations."
        icon={Settings}
      />
    </AppShell>
  );
}
