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
  Settings,
  Sparkles,
  Bell,
} from "lucide-react";
import LogoutButton from "../components/LogoutButton";

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
      <aside className="w-60 shrink-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 text-white justify-between flex flex-col p-4">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg px-2 py-3 mb-4">
            <Sparkles className="w-5 h-5 text-purple-300" />
            Eventora
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon, badge }) => {
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
                  {badge && (
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                  )}
                </Link>
              );
            })}

            {user.role === "admin" && (
              <Link
                href="/dashboard/admin"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  pathname === "/dashboard/admin"
                    ? "bg-white text-indigo-900"
                    : "text-pink-300 hover:bg-white/10"
                }`}
              >
                Admin Panel →
              </Link>
            )}
          </nav>
        </div>
        {/* Promo card  */}
        <div className="mt-auto pt-4">
          <div className="bg-white/10 rounded-2xl p-4 mb-3">
            <p className="text-sm font-semibold mb-1">
              Get early access to new events
            </p>
            <p className="text-xs text-purple-200 mb-3">
              Be the first to know about amazing experiences.
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-white/90 text-indigo-900 text-xs font-medium py-2 rounded-full hover:bg-white">
              <Bell className="w-3.5 h-3.5" />
              Enable Alerts
            </button>
          </div>
        </div>
        <LogoutButton />
      </aside>

      <div className="flex-1 px-4 py-2 bg-zinc-50">{children}</div>
    </div>
  );
}
