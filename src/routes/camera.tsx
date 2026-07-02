import { createFileRoute } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/camera")({
  component: Page,
  head: () => ({ meta: [{ title: "Camera Feed — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Camera Feed"
        subtitle="Full-resolution multi-angle camera grid."
        icon={Camera}
      />
    </AppShell>
  );
}
