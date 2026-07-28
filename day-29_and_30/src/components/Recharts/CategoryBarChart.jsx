import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS_ARRAY = [
  "#f97316",
  "#10b981",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#0ea5e9",
  "#f43f5e",
];

export default function CategoryBarChart({ data }) {
  if (data.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-12">
        No spending data yet
      </p>
    );
  }

  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={90} />
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {sorted.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS_ARRAY[index % CATEGORY_COLORS_ARRAY.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
