// app/dashboard/layout.jsx — the sidebar/nav shell, Client Component
"use client";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  return (
    <div className="flex">
      <aside className="w-56 shrink-0 border-r bg-white p-4">
        <h2 className="text-xs font-semibold uppercase text-gray-400 mb-3">
          Event Management
        </h2>
        {!loading && user?.role === "admin" && (
          <Link href="/admin" className="text-indigo-600 font-medium">
            Admin Panel →
          </Link>
        )}
        <LogoutButton />
      </aside>
      <div className="flex-1 px-8 py-6">{children}</div>
    </div>
  );
}
