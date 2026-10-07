"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "../store/store";

import {
  User,
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
  AlertCircleIcon,
} from "lucide-react";
import { fetchCurrentUser, logOut } from "../store/slice/authSlice";
import { FiFile } from "react-icons/fi";
import { socket } from "../lib/socket";
import toast from "react-hot-toast";
import {
  applyRealtimeTicketUpdate,
  Ticket as TicketInterface,
} from "../store/slice/ticketSlice";
import { TicketActivity } from "../store/slice/activitySlice";
import {
  addNotification,
  markAsRead,
  markAllAsRead,
} from "../store/slice/notificationSlice";
import useOnClickOutside from "../hook/useOnClickOutside";

interface CommonLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: House,
    roles: ["Customer", "SupportAgent", "Developer", "Admin"],
  },
  {
    name: "Tickets",
    href: "/dashboard/tickets",
    icon: Ticket,
    roles: ["Customer", "SupportAgent", "Developer", "Admin"],
  },
  {
    name: "Create Ticket",
    href: "/dashboard/create-ticket",
    icon: Plus,
    roles: ["Customer"],
  },
  {
    name: "SLA Monitoring",
    href: "/dashboard/sla",
    icon: AlertCircleIcon,
    roles: ["SupportAgent", "Developer", "Admin"],
  },
  {
    name: "Users Management",
    href: "/dashboard/users",
    icon: User,
    roles: ["Admin"],
  },
  {
    name: "Reports",
    href: "/dashboard/report",
    icon: FiFile,
    roles: ["Admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["Customer", "SupportAgent", "Developer", "Admin"],
  },
];

export default function CommonLayout({ children }: CommonLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const notifications = useSelector(
    (state: RootState) => state.notificationSlice.items,
  );
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(notifRef, () => setNotifOpen(false));
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const handleAuthExpired = async ({ message }: { message: string }) => {
      console.error("Socket authentication expired:", message);
      socket.disconnect();
      try {
        await dispatch(logOut()).unwrap();
      } finally {
        router.push("/");
      }
    };

    const connectSocket = async () => {
      try {
        const res = await fetch("/api/auth/socket-token", {
          credentials: "include",
        });
        const { token } = await res.json();

        if (!isMounted) return;

        socket.auth = { token };
        socket.on("auth:expired", handleAuthExpired);
        socket.connect();
      } catch (error) {
        console.error("Failed to fetch socket token:", error);
      }
    };

    void connectSocket();

    return () => {
      isMounted = false;
      socket.off("auth:expired", handleAuthExpired);
      socket.disconnect();
    };
  }, [user?.id, dispatch, router]);

  useEffect(() => {
    const handleTicketUpdated = (payload: {
      ticket: TicketInterface;
      activity: TicketActivity;
    }) => {
      dispatch(applyRealtimeTicketUpdate(payload));
      if (payload.activity?.userId !== user?.id) {
        const message = `Ticket ${payload.ticket.ticketNumber} updated to ${payload.ticket.status.replace("_", " ")}`;
        toast.success(message);
        dispatch(
          addNotification({
            id: crypto.randomUUID(),
            message,
            ticketId: payload.ticket.id,
            read: false,
            createdAt: new Date().toISOString(),
          }),
        );
      }
    };
    socket.on("ticketUpdated", handleTicketUpdated);

    return () => {
      socket.off("ticketUpdated", handleTicketUpdated);
    };
  }, [dispatch, user?.id]);

  const SidebarContent = (
    <>
      <Link
        href="/dashboard"
        className="flex h-[60px] items-center gap-3 border-b border-slate-700/70 px-6"
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
        {navigation
          .filter((item) => user && item.roles.includes(user.role))
          .map(({ name, href, icon: Icon }) => {
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
            dispatch(logOut());
            router.push("/");
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
        <header className="z-10 flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-20">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-xs font-medium text-indigo-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-slate-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={`/dashboard/tickets`}
                          onClick={() => {
                            dispatch(markAsRead(n.id));
                            setNotifOpen(false);
                          }}
                          className="block border-b border-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                        >
                          {n.message}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
