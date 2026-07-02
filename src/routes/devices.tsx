import { createFileRoute } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/dashboard";

export const Route = createFileRoute("/devices")({
  component: Page,
  head: () => ({ meta: [{ title: "Device Management — SORTIFY AI" }] }),
});

function Page() {
  return (
    <AppShell>
      <PlaceholderPage
        title="Device Management"
        subtitle="Provision, update firmware and monitor ESP32 fleet."
        icon={Cpu}
      />
    </AppShell>
  );
}
