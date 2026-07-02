const CATS = [
  { name: "Plastic", weight: 128.4, pct: 32, color: "#00E5FF" },
  { name: "Metal", weight: 74.1, pct: 18, color: "#8B5CF6" },
  { name: "Paper", weight: 96.7, pct: 24, color: "#3B82F6" },
  { name: "Organic", weight: 62.3, pct: 15, color: "#22C55E" },
  { name: "Glass", weight: 28.9, pct: 7, color: "#F59E0B" },
  { name: "E-Waste", weight: 15.6, pct: 4, color: "#EF4444" },
];

export function WasteCategories() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Waste Categories
        </h3>
        <span className="text-[11px] text-muted-foreground">Today · 406 kg total</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {CATS.map((c) => (
          <div
            key={c.name}
            className="relative overflow-hidden rounded-xl border border-primary/10 bg-white/[0.02] p-4 transition hover:border-primary/30"
          >
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-xl"
              style={{ background: c.color }}
            />
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }}
              />
              <span className="text-xs font-semibold text-foreground">{c.name}</span>
            </div>
            <div className="relative mt-3 font-mono text-2xl font-bold text-foreground">
              {c.weight}
              <span className="ml-1 text-xs font-normal text-muted-foreground">kg</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.pct}%`,
                  background: c.color,
                  boxShadow: `0 0 8px ${c.color}`,
                }}
              />
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">
              <span className="font-mono font-semibold" style={{ color: c.color }}>
                {c.pct}%
              </span>{" "}
              of total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}