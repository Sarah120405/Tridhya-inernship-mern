import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-violet-50">
      <h1 className="text-3xl font-bold text-violet-700">404</h1>
      <p className="text-violet-500">This page doesn't exist.</p>
      <Link
        href="/"
        className="rounded-xl bg-violet-600 px-4 py-2 text-white font-semibold hover:bg-violet-700 transition"
      >
        Back to home
      </Link>
    </div>
  );
}
