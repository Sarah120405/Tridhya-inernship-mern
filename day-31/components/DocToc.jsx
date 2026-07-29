// components/DocTOC.jsx
"use client";

export default function DocTOC({ headings }) {
  if (headings.length === 0) return null;

  function scrollToHeading(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="sticky top-6">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
        On This Page
      </h3>
      <ul className="flex flex-col gap-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <button
              onClick={() => scrollToHeading(h.id)}
              className="text-left text-slate-500 hover:text-indigo-600 transition"
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
