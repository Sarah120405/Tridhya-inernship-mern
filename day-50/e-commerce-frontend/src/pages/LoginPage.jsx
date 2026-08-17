import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Log in to continue shopping
        </p>
        <AuthForm mode="login" />
        <p className="text-sm text-slate-500 text-center mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
