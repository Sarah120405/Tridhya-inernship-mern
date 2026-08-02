"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
    router.refresh(); // forces Server Components on the next page to re-fetch, clearing any stale "logged in" state
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-slate-500 hover:text-rose-600"
    >
      Log out
    </button>
  );
}
