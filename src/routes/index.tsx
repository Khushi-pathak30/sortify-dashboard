import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Weight, Boxes, Target, Cpu, BellRing, HeartPulse, Truck, Gauge, WifiOff, Timer } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { KpiCard, LiveMonitor, SensorStatus, AiFlow, WasteCategories, Analytics, AlertsPanel, ModelInfo, ClassificationTable } from "@/components/dashboard";
import { WASTE_COLORS, WASTE_TYPES } from "@/lib/mock";

import { useEffect, useState } from "react";
import { sortifyApi, type LiveSummary } from "@/lib/sortify-api";

// Seeded so SSR and client render identical values (avoids hydration mismatch).
const WASTE_TOTALS: Record<string, number> = WASTE_TYPES.reduce((acc, w, i) => {
  acc[w] = 240 + ((i * 137) % 760);
  return acc;
}, {} as Record<string, number>);

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const [summary, setSummary] = useState<LiveSummary | null>(null);

  useEffect(() => {
    let active = true;
    const fetchSummary = async () => {
      try {
        const data = await sortifyApi.summary();
        if (active) setSummary(data);
      } catch (err) {
        console.error("Dashboard: failed to fetch summary:", err);
      }
    };
    fetchSummary();
    const interval = setInterval(fetchSummary, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Command <span className="text-primary text-glow-cyan">Overview</span>
            </h1>
            <p className="text-sm text-muted-foreground">Real-time telemetry from the SORTIFY AI segregation network.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />All systems nominal
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Waste Today" value={summary?.totalWaste ?? 2842} suffix=" kg" icon={<Weight className="h-5 w-5" />} trend={8.4} accent="primary" />
          <KpiCard label="Objects Classified" value={summary?.totalWaste ? Math.round(summary.totalWaste / 0.95) : 12847} icon={<Boxes className="h-5 w-5" />} trend={12.1} accent="secondary" />
          <KpiCard label="AI Accuracy" value={96.4} decimals={1} suffix="%" icon={<Target className="h-5 w-5" />} trend={0.6} accent="accent" />
          <KpiCard label="Connected Devices" value={summary?.connectedDevices ?? 47} icon={<Cpu className="h-5 w-5" />} trend={-1.2} accent="secondary" />
          <KpiCard label="Offline Devices" value={summary?.connectedDevices ? 0 : 3} icon={<WifiOff className="h-5 w-5" />} trend={-22} accent="warning" />
          <KpiCard label="Active Alerts" value={summary?.streaming ? 2 : 5} icon={<BellRing className="h-5 w-5" />} trend={-14} accent="warning" />
          <KpiCard label="Avg Processing" value={summary?.avgProcessingMs ?? 78} suffix=" ms" icon={<Timer className="h-5 w-5" />} trend={-6} accent="primary" />
          <KpiCard label="Trucks Active" value={9} icon={<Truck className="h-5 w-5" />} trend={2} accent="accent" />
          <KpiCard label="Avg Fill Level" value={64} suffix="%" icon={<Gauge className="h-5 w-5" />} trend={4} accent="warning" />
          <KpiCard label="System Health" value={98} suffix="%" icon={<HeartPulse className="h-5 w-5" />} trend={1.4} accent="success" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {(["Plastic","Paper","Metal","Organic","Glass","E-Waste","Cardboard"] as const).map((w) => (
            <div key={w} className="glass rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: WASTE_COLORS[w] }} />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{w}</span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-foreground">
                {w === "Metal" ? `${summary?.metalWaste ?? WASTE_TOTALS[w]} kg` : 
                 w === "Organic" ? `${summary?.wetWaste ?? WASTE_TOTALS[w]} kg` : 
                 w === "Plastic" ? `${summary?.dryWaste ?? WASTE_TOTALS[w]} kg` : 
                 `${WASTE_TOTALS[w]} kg`}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2"><LiveMonitor /></div>
          <SensorStatus />
        </div>

        <AiFlow />
        <WasteCategories />
        <Analytics />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2"><AlertsPanel /></div>
          <ModelInfo />
        </div>

        <ClassificationTable />
      </motion.div>
    </AppShell>
  );
}
