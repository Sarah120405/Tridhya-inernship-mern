export default function Loading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
      <div className="h-8 w-96 bg-slate-200 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
