import { Image as ImageIcon } from "lucide-react";

type Row = {
  time: string;
  cls: string;
  conf: number;
  weight: number;
  bin: string;
  status: "Sorted" | "Pending" | "Error";
  color: string;
};

const ROWS: Row[] = [
  { time: "14:22:08", cls: "Plastic", conf: 96.4, weight: 0.24, bin: "Bin 02", status: "Sorted", color: "#00E5FF" },
  { time: "14:21:42", cls: "Paper", conf: 92.1, weight: 0.11, bin: "Bin 04", status: "Sorted", color: "#3B82F6" },
  { time: "14:21:19", cls: "Metal", conf: 98.7, weight: 0.38, bin: "Bin 01", status: "Sorted", color: "#8B5CF6" },
  { time: "14:20:55", cls: "Organic", conf: 88.3, weight: 0.52, bin: "Bin 05", status: "Pending", color: "#22C55E" },
  { time: "14:20:31", cls: "Glass", conf: 94.6, weight: 0.63, bin: "Bin 03", status: "Sorted", color: "#F59E0B" },
  { time: "14:20:04", cls: "E-Waste", conf: 89.2, weight: 0.18, bin: "Bin 06", status: "Error", color: "#EF4444" },
  { time: "14:19:38", cls: "Plastic", conf: 95.8, weight: 0.29, bin: "Bin 02", status: "Sorted", color: "#00E5FF" },
];

export function ClassificationTable() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Recent Classifications
        </h3>
        <span className="text-[11px] text-muted-foreground">Latest 7 events</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
              <th className="pb-2 pr-3 font-semibold">Time</th>
              <th className="pb-2 pr-3 font-semibold">Image</th>
              <th className="pb-2 pr-3 font-semibold">Predicted</th>
              <th className="pb-2 pr-3 font-semibold">Confidence</th>
              <th className="pb-2 pr-3 font-semibold">Weight</th>
              <th className="pb-2 pr-3 font-semibold">Bin</th>
              <th className="pb-2 pr-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {ROWS.map((r, i) => (
              <tr key={i} className="text-foreground hover:bg-primary/5">
                <td className="py-2.5 pr-3 font-mono text-[11px] text-muted-foreground">{r.time}</td>
                <td className="py-2.5 pr-3">
                  <div
                    className="grid h-9 w-9 place-items-center rounded-lg border"
                    style={{
                      borderColor: `${r.color}55`,
                      background: `linear-gradient(135deg, ${r.color}22, transparent)`,
                    }}
                  >
                    <ImageIcon className="h-4 w-4" style={{ color: r.color }} />
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      background: `${r.color}18`,
                      color: r.color,
                      border: `1px solid ${r.color}40`,
                    }}
                  >
                    {r.cls}
                  </span>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${r.conf}%`, background: r.color }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-foreground">{r.conf}%</span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 font-mono text-[11px]">{r.weight} kg</td>
                <td className="py-2.5 pr-3 font-mono text-[11px]">{r.bin}</td>
                <td className="py-2.5 pr-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      r.status === "Sorted"
                        ? "bg-success/15 text-success"
                        : r.status === "Pending"
                          ? "bg-warning/15 text-warning"
                          : "bg-danger/15 text-danger"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}