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
    <div className="relative group flex min-h-[170px] flex-col overflow-hidden rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-sm transition-all duration-300 over:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-fuchsia-100 opacity-40 blur-2xl transition-all duration-300 group-hover:scale-125" />
      <div className="flex items-center gap-2 w-full">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#6C5DD3]/15 to-fuchsia-100 flex items-center justify-center text-xl text-[#6C5DD3]">
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
        <span className="text-xs text-slate-800 mb-3">{description}</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 text-6xl text-[#EDE9FE] opacity-60 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 group-hover:text-fuchsia-300 -rotate-12">
        {icon_2}
      </div>
    </div>
  );
}

export { MetricCard };
