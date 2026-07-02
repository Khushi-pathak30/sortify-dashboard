import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/analytics")({
  component: Page,
  head: () => ({ meta: [{ title: "Waste Analytics — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Waste Analytics"
        subtitle="Deep-dive charts across categories, sites and time."
        icon={BarChart3}
      />
    </AppShell>
  );
}
