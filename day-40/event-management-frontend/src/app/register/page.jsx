// app/register/page.jsx
import AuthForm from "../components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <AuthForm mode="register" />
    </div>
  );
}
