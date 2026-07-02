import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export function KpiCard({
  label,
  value,
  suffix,
  decimals,
  icon,
  trend,
  accent = "primary",
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: ReactNode;
  trend: number;
  accent?: "primary" | "accent" | "secondary" | "success" | "warning" | "danger";
}) {
  const up = trend >= 0;
  const accentClass = {
    primary: "text-primary",
    accent: "text-accent",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }[accent];
  const bgClass = {
    primary: "bg-primary/10",
    accent: "bg-accent/10",
    secondary: "bg-secondary/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
    danger: "bg-danger/10",
  }[accent];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass group relative overflow-hidden rounded-2xl p-5"
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full ${bgClass} blur-2xl opacity-70`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`font-mono text-3xl font-bold ${accentClass} text-glow-cyan`}>
              <AnimatedNumber value={value} decimals={decimals} />
            </span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${bgClass} ${accentClass} border border-current/20`}>
          {icon}
        </div>
      </div>
      <div className="relative mt-3 flex items-center gap-1.5 text-xs">
        {up ? (
          <TrendingUp className="h-3.5 w-3.5 text-success" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-danger" />
        )}
        <span className={up ? "text-success" : "text-danger"}>
          {up ? "+" : ""}
          {trend}%
        </span>
        <span className="text-muted-foreground">vs yesterday</span>
      </div>
    </motion.div>
  );
}