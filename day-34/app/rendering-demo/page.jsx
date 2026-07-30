import Link from "next/link";

const strategies = [
  {
    name: "SSG",
    badge: "Static",
    fullName: "Static Site Generation",
    desc: "Built once, never changes.",
    href: "/rendering-demo/ssg",
    color: "emerald",
  },
  {
    name: "ISR",
    badge: "Incremental",
    fullName: "Incremental Static Regeneration",
    desc: "Refreshes periodically in the background.",
    href: "/rendering-demo/isr",
    color: "amber",
  },
  {
    name: "SSR",
    badge: "Dynamic",
    fullName: "Server-Side Rendering",
    desc: "Fresh on every single request.",
    href: "/rendering-demo/ssr",
    color: "rose",
  },
];

export default function RenderingDemoPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Rendering Strategies Demo</h1>
      <p className="text-slate-500 mb-8">
        Click a card, then reload its page a few times to see the difference.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 bg-${s.color}-100 text-${s.color}-700`}
            >
              {s.badge}
            </span>
            <h2 className="font-bold text-lg text-slate-800">{s.name}</h2>
            <p className="text-xs text-slate-400 mb-2">{s.fullName}</p>
            <p className="text-sm text-slate-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
