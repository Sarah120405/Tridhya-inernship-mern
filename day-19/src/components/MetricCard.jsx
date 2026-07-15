function MetricCard({ icon, title, value, description, subtitle, icon_2 }) {
  return (
    <div className="relative overflow-hidden group p-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-100 opacity-40 blur-2xl transition-all duration-300 group-hover:scale-125" />

      <div className="flex items-center gap-2 w-full">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-2xl text-white shadow-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-base uppercase font-playfair font-bold text-slate-500 tracking-normal">
            {title}
          </span>
          <span className="text-xs text-slate-400 mt-0.5">{subtitle}</span>
          <div className="w-full border-t my-4" />
        </div>
      </div>
      <div className="flex flex-col gap-1 items-start justify-center">
        <span className="text-6xl font-bold font-playfair text-slate-800 leading-none mb-3">
          {value}
        </span>
        <span className="text-xs text-slate-500">{description}</span>
      </div>
      <div className="absolute bottom-4 right-4 text-8xl text-slate-300 group-hover:text-indigo-400 group-hover:scale-110 group-hover:rotate-0 -rotate-12 pointer-events-none transition-all duration-500">
        {icon_2}
      </div>
    </div>
  );
}

export { MetricCard };
