import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/ai")({
  component: Page,
  head: () => ({ meta: [{ title: "AI Prediction — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="AI Prediction"
        subtitle="Model inspector, class probabilities and confusion metrics."
        icon={Brain}
      />
    </AppShell>
  );
}
