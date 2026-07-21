"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-rose-50">
      <h2 className="text-xl font-bold text-rose-700">Something went wrong</h2>
      <p className="text-rose-500 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-rose-600 px-4 py-2 text-white font-semibold hover:bg-rose-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
