import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CumulativeSpendChart({ data }) {
  if (data.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-12">
        No spending yet this month
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
        <Line
          type="monotone"
          dataKey="cumulativeSpend"
          name="Cumulative Spend"
          stroke="#f43f5e"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default memo(CumulativeSpendChart);
