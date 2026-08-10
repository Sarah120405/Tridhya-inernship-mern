"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { refetchUser } = useAuth();

  async function handleLogout() {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    await refetchUser();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-200 hover:bg-white/10 w-full"
    >
      <LogOut className="w-4 h-4" />
      Log out
    </button>
  );
}
