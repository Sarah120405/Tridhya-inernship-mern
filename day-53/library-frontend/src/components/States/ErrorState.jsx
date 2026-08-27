export default function ErrorState({ error }) {
  return (
    <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-6 text-center h-full w-full">
      <p className="text-sm font-medium text-rose-700">Something went wrong</p>
      <p className="mt-1 text-xs text-rose-500">{error}</p>
    </div>
  );
}
