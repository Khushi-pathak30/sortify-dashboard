import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Activity,
  Camera,
  Brain,
  BarChart3,
  FileText,
  BellRing,
  Cpu,
  Settings,
  Wifi,
  Bell,
  UserCircle2,
  Recycle,
  CircleDot,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Live Monitoring", to: "/live", icon: Activity },
  { label: "Camera Feed", to: "/camera", icon: Camera },
  { label: "AI Prediction", to: "/ai", icon: Brain },
  { label: "Waste Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Alerts", to: "/alerts", icon: BellRing },
  { label: "Device Management", to: "/devices", icon: Cpu },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="glass-strong flex h-full w-64 shrink-0 flex-col rounded-none border-r border-primary/15 lg:rounded-2xl lg:border">
      <div className="flex items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent glow-cyan">
            <Recycle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-glow-cyan text-base font-extrabold tracking-wide text-primary">
              SORTIFY <span className="text-accent">AI</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Smart Waste Sys
            </div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`relative group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary glow-cyan"
                  : "text-sidebar-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_12px_var(--color-primary)]"
                />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-4">
        <div className="flex items-center gap-2">
          <CircleDot className="h-4 w-4 text-success pulse-dot" />
          <span className="text-xs font-semibold text-foreground">System Online</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Edge Impulse v2.3 · ESP32 linked · streaming.
        </p>
      </div>
    </aside>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const now = useNow();
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 rounded-2xl border border-primary/10 px-4 py-3">
      <button onClick={onMenu} className="lg:hidden text-muted-foreground">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden md:flex flex-col leading-tight">
        <span className="font-mono text-sm font-semibold text-foreground">{timeStr}</span>
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{dateStr}</span>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <StatusPill label="ESP32" ok />
        <StatusPill label="Wi-Fi" ok icon={<Wifi className="h-3 w-3" />} />
        <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-primary/15 bg-primary/5 text-primary hover:glow-cyan transition">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-2 py-1.5 pr-3">
          <UserCircle2 className="h-6 w-6 text-primary" />
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold text-foreground">Arjun M.</div>
            <div className="text-[10px] text-muted-foreground">Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusPill({ label, ok, icon }: { label: string; ok: boolean; icon?: ReactNode }) {
  return (
    <div
      className={`hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        ok
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success pulse-dot" : "bg-danger"}`} />
      {icon}
      {label}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen p-3 lg:p-4">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[calc(100vh-2rem)]">
            <Sidebar />
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                onClick={(e) => e.stopPropagation()}
                className="h-full w-64"
              >
                <Sidebar onClose={() => setOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <TopBar onMenu={() => setOpen(true)} />
          <main className="min-w-0">{children}</main>
          <footer className="glass mt-4 rounded-2xl px-5 py-4 text-center text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">SORTIFY AI</span> — Smart Waste
            Segregation System · Powered by{" "}
            <span className="text-primary">ESP32</span> ·{" "}
            <span className="text-accent">Edge Impulse</span> ·{" "}
            <span className="text-secondary">Flask</span> ·{" "}
            <span className="text-success">Supabase</span>
          </footer>
        </div>
      </div>
    </div>
  );
}