"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "../store/store";

import {
  Ticket,
  House,
  Plus,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Headset,
} from "lucide-react";
import { fetchCurrentUser, logOut } from "../store/slice/authSlice";

interface CommonLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: House },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  {
    name: "Create Ticket",
    href: "/dashboard/create-ticket",
    icon: Plus,
  },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function CommonLayout({ children }: CommonLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const SidebarContent = (
    <>
      <Link
        href="/dashboard"
        className="flex h-[72px] items-center gap-3 border-b border-slate-700/70 px-6"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/30">
          <Headset className="h-5 w-5 text-white" />
        </div>

        <span className="text-xl font-bold tracking-tight text-white">
          Support
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Hub
          </span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-5">
        {navigation.map(({ name, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={name}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700/70 p-3">
        <button
          type="button"
          onClick={() => {
            console.log("Log out");

            dispatch(logOut());
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-54 shrink-0 flex-col bg-[#111c32] lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="relative flex h-full w-72 flex-col bg-[#111c32] shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-5 text-slate-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Section */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="z-10 flex h-[65px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search tickets, users, or anything..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>

              <div className="hidden sm:block">
                <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs text-slate-500">{user?.role ?? "User"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
