const BADGE_STYLES = {
  Static: "bg-emerald-100 text-emerald-700",
  Dynamic: "bg-rose-100 text-rose-700",
  Incremental: "bg-amber-100 text-amber-700",
};

export default function RenderInfoCard({
  badge,
  title,
  description,
  timestamp,
  randomNumber,
  quote,
  children,
}) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <span
        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${BADGE_STYLES[badge]}`}
      >
        {badge}
      </span>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-500 mb-6">{description}</p>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-5">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
            Rendered At
          </p>
          <p className="text-lg font-mono text-slate-800">{timestamp}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
            Random Number (proves if this render re-ran)
          </p>
          <p className="text-3xl font-mono font-bold text-indigo-600">
            {randomNumber}
          </p>
        </div>

        {quote && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              External Fetch (GitHub Zen)
            </p>
            <p className="text-sm italic text-slate-600">{quote}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
