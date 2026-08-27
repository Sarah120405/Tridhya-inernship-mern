export default function EmptyState({ message, icon, description }) {
  return (
    <div className="rounded-xl bg-[#FAF7FF] px-4 py-10 text-center">
      {icon && (
        <div className="mb-2 flex justify-center text-[#9A93A3] text-2xl">
          {icon}
        </div>
      )}
      <p className="text-sm text-[#9A93A3]">{message}</p>
      <p className="mt-1 text-xs text-[#9A93A3]">{description}</p>
    </div>
  );
}
