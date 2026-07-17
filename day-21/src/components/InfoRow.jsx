function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700">{value ?? "—"}</span>
    </div>
  );
}
export { InfoRow };
