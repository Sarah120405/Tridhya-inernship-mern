import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FiAlertTriangle className="text-4xl text-slate-300 mb-3" />
      <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-500 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
