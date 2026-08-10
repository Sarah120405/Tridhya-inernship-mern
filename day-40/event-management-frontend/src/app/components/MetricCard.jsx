import { FiArrowDown, FiArrowUp } from "react-icons/fi";

function MetricCard({
  icon,
  title,
  value,
  trend,
  trendDirection = "up",
  icon_2,
}) {
  const isPositiveTrend = trendDirection === "up";
  return (
    <div className="relative overflow-hidden group p-4 rounded-2xl border border-violet-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-fuchsia-100 opacity-40 blur-2xl transition-all duration-300 group-hover:scale-125" />

      <div className="flex items-center gap-2 w-full">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-2xl text-violet-600 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-600 tracking-normal">
            {title}
          </span>
          <div className="w-full border-t my-2" />
        </div>
      </div>
      <div className="flex flex-col gap-1 items-start justify-center">
        <span className="text-2xl font-bold text-slate-800 mb-3">{value}</span>
        {trend && (
          <div
            className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
              isPositiveTrend ? "text-violet-700" : "text-pink-700"
            }`}
          >
            <span className={``}>
              {isPositiveTrend ? <FiArrowUp /> : <FiArrowDown />}
            </span>
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 right-4 text-7xl text-violet-100 group-hover:text-fuchsia-300 group-hover:scale-110 group-hover:rotate-0 -rotate-12 pointer-events-none transition-all duration-500">
        {icon_2}
      </div>
    </div>
  );
}

export { MetricCard };
