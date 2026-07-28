import { memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#10b981",
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#0ea5e9",
  "#f43f5e",
];

function ExpensePieChart({ data }) {
  if (data.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-12">
        No expense data yet
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default memo(ExpensePieChart);
