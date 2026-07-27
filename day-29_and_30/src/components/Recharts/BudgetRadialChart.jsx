import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function BudgetRadialChart({ budgetProgress }) {
  const data = budgetProgress.map((b) => ({
    name: b.category,
    percentUsed: Math.min(b.percentUsed, 100),
    fill: b.isOverBudget
      ? "#f43f5e"
      : b.percentUsed >= (b.alertThreshold || 90)
        ? "#f59e0b"
        : "#10b981",
  }));

  if (data.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-12">No budgets yet</p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart
        data={data}
        innerRadius="20%"
        outerRadius="90%"
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar
          dataKey="percentUsed"
          background
          clockWise
          cornerRadius={8}
        />
        <Tooltip
          formatter={(value, name, props) => [`${value}%`, props.payload.name]}
          labelFormatter={() => ""}
        />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: "12px", paddingTop: "2px" }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
