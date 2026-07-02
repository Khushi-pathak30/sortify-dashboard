import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const pieData = [
  { name: "Plastic", value: 32, color: "#00E5FF" },
  { name: "Paper", value: 24, color: "#3B82F6" },
  { name: "Metal", value: 18, color: "#8B5CF6" },
  { name: "Organic", value: 15, color: "#22C55E" },
  { name: "Glass", value: 7, color: "#F59E0B" },
  { name: "E-Waste", value: 4, color: "#EF4444" },
];

const barData = [
  { day: "Mon", kg: 320 },
  { day: "Tue", kg: 412 },
  { day: "Wed", kg: 378 },
  { day: "Thu", kg: 450 },
  { day: "Fri", kg: 508 },
  { day: "Sat", kg: 289 },
  { day: "Sun", kg: 210 },
];

const lineData = Array.from({ length: 12 }, (_, i) => ({
  w: `W${i + 1}`,
  accuracy: 88 + Math.round(Math.sin(i / 2) * 4 + i / 3),
  volume: 200 + Math.round(Math.cos(i / 3) * 60 + i * 12),
}));

const tooltipStyle = {
  background: "rgba(11,17,32,0.95)",
  border: "1px solid rgba(0,229,255,0.3)",
  borderRadius: 12,
  color: "#e5f3ff",
  fontSize: 12,
};

export function Analytics() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground">
          Waste Distribution
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                stroke="none"
              >
                {pieData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
              {d.name} <span className="ml-auto font-mono text-foreground">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground">
          Daily Collection (kg)
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#7a8ba8" fontSize={11} />
              <YAxis stroke="#7a8ba8" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,229,255,0.08)" }} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <Bar dataKey="kg" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground">
          Weekly Trends
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="w" stroke="#7a8ba8" fontSize={11} />
              <YAxis stroke="#7a8ba8" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#00E5FF"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#00E5FF" }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#8B5CF6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Accuracy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> Volume
          </span>
        </div>
      </div>
    </div>
  );
}