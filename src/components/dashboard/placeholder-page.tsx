import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass grid min-h-[70vh] place-items-center rounded-2xl p-10 text-center"
    >
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary glow-cyan">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-primary text-glow-cyan">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
          Module streaming
        </div>
      </div>
    </motion.div>
  );
}