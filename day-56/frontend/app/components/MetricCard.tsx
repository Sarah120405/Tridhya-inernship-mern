import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  description?: string;
  icon_2?: ReactNode;
};

function MetricCard({
  icon,
  title,
  value,
  description,
  icon_2,
}: MetricCardProps) {
  return (
    <div className="group relative flex min-h-[170px] flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100 opacity-40 blur-2xl transition-all duration-300 group-hover:scale-125" />

      <div className="flex w-full items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/15 to-blue-100 text-xl text-blue-600">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-normal text-slate-600">
            {title}
          </span>
          <div className="my-2 w-full border-t border-blue-100" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-start justify-center gap-1 pr-14">
        <span className="mb-1 text-2xl font-bold text-slate-800">{value}</span>
        {description && (
          <span className="line-clamp-2 text-xs text-slate-500">
            {description}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 -rotate-12 text-6xl text-blue-50 opacity-60 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:text-blue-300">
        {icon_2}
      </div>
    </div>
  );
}

export { MetricCard };
