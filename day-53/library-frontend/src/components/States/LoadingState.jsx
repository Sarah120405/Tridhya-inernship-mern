export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EDE9FE] border-t-[#8B5CF6]" />
      <p className="text-sm text-[#9A93A3]">{message}</p>
    </div>
  );
}
