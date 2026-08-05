"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Search,
  BookMarked,
  Heart,
  Sparkles,
  Bell,
  FilePen,
} from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import { FiList, FiPenTool } from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Explore Events", icon: Search },
  { href: "/dashboard/my-bookings", label: "My Bookings", icon: BookMarked },
  { href: "/dashboard/favorites", label: "Wishlist", icon: Heart },
];

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 h-screen sticky top-0 overflow-y-auto bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 text-white justify-between flex flex-col p-4">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg px-2 py-3 mb-4">
            <Sparkles className="w-5 h-5 text-purple-300" />
            Eventora
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-white text-indigo-900 font-medium"
                      : "text-purple-200 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{label}</span>
                </Link>
              );
            })}
          </nav>

          {user.role === "admin" && (
            <div>
              <h2 className="text-xs font-semibold uppercase text-pink-200 m-3">
                Admin Tools
              </h2>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/dashboard/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/admin"
                      ? "bg-white text-indigo-900"
                      : "text-purple-200 hover:bg-white/10"
                  }`}
                >
                  <FilePen className="w-4 h-4" />
                  Admin Panel
                </Link>
                <Link
                  href="/dashboard/admin/event/"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/admin/event"
                      ? "bg-white text-indigo-900"
                      : "text-purple-200 hover:bg-white/10"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                  Manage Events
                </Link>
              </nav>
            </div>
          )}
        </div>
        {/* Promo card  */}

        <LogoutButton />
      </aside>

      <div className="flex-1 px-4 py-2 bg-zinc-50">{children}</div>
    </div>
  );
}
