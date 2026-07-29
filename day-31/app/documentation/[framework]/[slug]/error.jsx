// app/documentation/[framework]/[slug]/error.jsx
"use client";

export default function DocError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
      <h2 className="text-lg font-bold text-slate-800 mb-2">
        Couldn't load this page
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        This is likely a temporary GitHub API issue (rate limit or
        connectivity). Try again in a moment.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
