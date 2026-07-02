import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { USERS, type User } from "@/lib/mock";
import { Shield, Wrench, Eye, UserCog } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/users")({
  component: Page,
  head: () => ({ meta: [{ title: "Users — SORTIFY AI" }] }),
});

const ROLE_ICON: Record<User["role"], typeof Shield> = {
  Admin: Shield,
  Supervisor: Eye,
  Operator: UserCog,
  Maintenance: Wrench,
};

const PERMISSIONS: Record<User["role"], string[]> = {
  Admin: ["Full access", "Manage users", "Configure system", "View billing"],
  Supervisor: ["View all", "Approve reports", "Manage alerts"],
  Operator: ["View live", "Manage bins", "Acknowledge alerts"],
  Maintenance: ["View devices", "Restart devices", "Update firmware"],
};

const ACTIVITY = [
  "Signed in from 10.0.14.22",
  "Resolved alert ALT-0032",
  "Restarted device ESP32-014",
  "Exported weekly report",
  "Updated bin BIN-0087 threshold",
  "Rotated API key",
];

function Page() {
  const [role, setRole] = useState<"all" | User["role"]>("all");
  const filtered = USERS.filter((u) => role === "all" || u.role === role);

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              User <span className="text-primary text-glow-cyan">Management</span>
            </h1>
            <p className="text-sm text-muted-foreground">Roles, permissions and recent activity.</p>
          </div>
          <div className="flex gap-2">
            {(["all", "Admin", "Supervisor", "Operator", "Maintenance"] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                  role === r ? "bg-primary text-primary-foreground glow-cyan" : "border border-primary/20 bg-primary/5 text-muted-foreground hover:text-foreground"
                }`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((u) => {
            const Icon = ROLE_ICON[u.role];
            return (
              <div key={u.id} className="glass rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                        u.active ? "border-success/30 bg-success/10 text-success" : "border-muted bg-muted text-muted-foreground"
                      }`}>{u.active ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>Role: <span className="font-semibold text-foreground">{u.role}</span></span>
                      <span>·</span>
                      <span>Last login: <span className="text-foreground">{u.lastLogin}</span></span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Permissions</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PERMISSIONS[u.role].map((p) => (
                      <span key={p} className="rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[11px] text-foreground">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Recent activity</div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {ACTIVITY.slice(0, 3).map((a, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
