import { createFileRoute } from "@tanstack/react-router";
import { BellRing } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/alerts")({
  component: Page,
  head: () => ({ meta: [{ title: "Alerts — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Alerts"
        subtitle="Full alert history, filters and acknowledgements."
        icon={BellRing}
      />
    </AppShell>
  );
}
