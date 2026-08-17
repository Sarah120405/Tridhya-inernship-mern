import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Sign up to start shopping
        </p>
        <AuthForm mode="register" />
        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
