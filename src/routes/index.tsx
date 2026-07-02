import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Weight,
  Boxes,
  Target,
  Cpu,
  BellRing,
  HeartPulse,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  KpiCard,
  LiveMonitor,
  SensorStatus,
  AiFlow,
  WasteCategories,
  Analytics,
  AlertsPanel,
  ModelInfo,
  ClassificationTable,
} from "@/components/dashboard";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Command <span className="text-primary text-glow-cyan">Overview</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time telemetry from the SORTIFY AI segregation unit.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
            All systems nominal
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Waste Collected" value={406} decimals={0} suffix="kg" icon={<Weight className="h-5 w-5" />} trend={8.4} accent="primary" />
          <KpiCard label="Objects Classified" value={12847} icon={<Boxes className="h-5 w-5" />} trend={12.1} accent="secondary" />
          <KpiCard label="AI Accuracy" value={96.4} decimals={1} suffix="%" icon={<Target className="h-5 w-5" />} trend={0.6} accent="accent" />
          <KpiCard label="Active Devices" value={14} icon={<Cpu className="h-5 w-5" />} trend={-1.2} accent="secondary" />
          <KpiCard label="Alerts Today" value={5} icon={<BellRing className="h-5 w-5" />} trend={-22} accent="warning" />
          <KpiCard label="System Health" value={98} suffix="%" icon={<HeartPulse className="h-5 w-5" />} trend={1.4} accent="success" />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <LiveMonitor />
          </div>
          <SensorStatus />
        </div>

        <AiFlow />

        <WasteCategories />

        <Analytics />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AlertsPanel />
          </div>
          <ModelInfo />
        </div>

        <ClassificationTable />
      </motion.div>
    </AppShell>
  );
}
