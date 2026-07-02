import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/reports")({
  component: Page,
  head: () => ({ meta: [{ title: "Reports — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Reports"
        subtitle="Scheduled CSV/PDF exports for compliance teams."
        icon={FileText}
      />
    </AppShell>
  );
}
