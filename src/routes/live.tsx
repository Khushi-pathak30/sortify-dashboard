import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/live")({
  component: Page,
  head: () => ({ meta: [{ title: "Live Monitoring — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Live Monitoring"
        subtitle="Streaming detection frames from every active bin."
        icon={Activity}
      />
    </AppShell>
  );
}
