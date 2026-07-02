import { Brain, CircleDot } from "lucide-react";

const ROWS: [string, string][] = [
  ["Model Name", "SortifyNet-v2.3"],
  ["AI Accuracy", "96.4%"],
  ["Inference Time", "42 ms"],
  ["Model Version", "2.3.1 (edge)"],
  ["Last Updated", "2 hr ago"],
  ["Framework", "Edge Impulse · TFLite"],
];

export function ModelInfo() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent glow-purple">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            AI Model
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-success">
            <CircleDot className="h-3 w-3 pulse-dot" /> Running · Healthy
          </div>
        </div>
      </div>
      <div className="divide-y divide-primary/10">
        {ROWS.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className="font-mono text-xs font-semibold text-foreground">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}