import { motion } from "framer-motion";
import {
  ScanSearch,
  Camera,
  UploadCloud,
  Brain,
  RotateCw,
  Trash2,
  Database,
} from "lucide-react";

const STEPS = [
  { label: "Object Detected", icon: ScanSearch },
  { label: "Image Captured", icon: Camera },
  { label: "Cloud Upload", icon: UploadCloud },
  { label: "AI Classification", icon: Brain },
  { label: "Servo Rotation", icon: RotateCw },
  { label: "Waste Sorted", icon: Trash2 },
  { label: "Database Updated", icon: Database },
];

export function AiFlow() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          AI Processing Flow
        </h3>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          Live · 1.2s cycle
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex min-w-[120px] flex-col items-center gap-2"
              >
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary glow-cyan">
                    <Icon className="h-5 w-5" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-xl border border-primary"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                </div>
                <div className="text-center text-[11px] font-medium text-foreground">
                  {s.label}
                </div>
              </motion.div>
              {i < STEPS.length - 1 && (
                <svg width="36" height="16" viewBox="0 0 36 16" className="shrink-0">
                  <line
                    x1="0"
                    y1="8"
                    x2="36"
                    y2="8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="stroke-primary/60 flow-dash"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}