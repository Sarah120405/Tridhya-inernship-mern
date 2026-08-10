"use client";

import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // dashboard/layout.jsx already handles the redirect

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Welcome, {user.name}
      </h1>
      <p className="text-slate-500">
        You're logged in as a{user.role === "admin" ? "n" : ""} {user.role}.
      </p>
    </div>
  );
}
