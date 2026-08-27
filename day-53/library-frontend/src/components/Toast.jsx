// components/Toast.jsx
export default function Toast({ message, error }) {
  if (!message && !error) return null;
  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
        message
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
      }`}
    >
      {message || error}
    </div>
  );
}
