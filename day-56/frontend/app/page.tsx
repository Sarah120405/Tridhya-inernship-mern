"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Users,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Ticket,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import Modal from "./components/Modal";
import AuthForm from "./components/AuthForm";

type AuthMode = "login" | "register";

export default function Home() {
  const [activeModal, setActiveModal] = useState<AuthMode | null>(null);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fcfaf7] text-[#111a4d]">
      <header className="border-b border-purple-100 bg-[#fcfaf7]/95 top-0 left-0 z-50 w-full fixed">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md">
              <Ticket className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Support
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            <a
              href="#home"
              className="border-b-2 border-indigo-600 pb-1 text-sm font-semibold text-indigo-600"
            >
              Home
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal("login")}
              className="rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#111a4d] transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              Login
            </button>

            <button
              onClick={() => setActiveModal("register")}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Left content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
              <Sparkles className="h-4 w-4" />
              AI-Powered Support
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-[#101947] sm:text-6xl">
              Smarter Support,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Happier Customers
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Our AI-powered ticket management system helps you create, track
              and resolve support tickets faster — with the right people, the
              right priority, and the right insights.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveModal("register")}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-[#111a4d] shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Right illustration */}
          <div className="relative hidden min-h-[480px] lg:block">
            <div className="absolute right-2 top-12 w-[90%] rounded-2xl border-8 border-[#243b82] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                    <Ticket className="h-4 w-4 text-white" />
                  </div>

                  <span className="text-sm font-bold">SupportHub</span>
                </div>

                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
              </div>

              <div className="flex min-h-[300px]">
                <div className="w-32 border-r border-slate-100 bg-slate-50 p-3">
                  <div className="mb-2 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white">
                    Tickets
                  </div>

                  <div className="space-y-2 px-3 py-2 text-xs text-slate-500">
                    Messages
                  </div>

                  <div className="space-y-2 px-3 py-2 text-xs text-slate-500">
                    Users
                  </div>

                  <div className="space-y-2 px-3 py-2 text-xs text-slate-500">
                    Reports
                  </div>
                </div>

                {/* Tickets */}
                <div className="flex-1 p-5">
                  <div className="mb-4 h-9 rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-400">
                    Search tickets...
                  </div>

                  <div className="space-y-3">
                    <TicketRow
                      number="#T-1024"
                      title="Login issue"
                      priority="High"
                      status="Open"
                    />

                    <TicketRow
                      number="#T-1023"
                      title="Payment failed"
                      priority="Medium"
                      status="In Progress"
                    />

                    <TicketRow
                      number="#T-1022"
                      title="Feature request"
                      priority="Low"
                      status="Open"
                    />

                    <TicketRow
                      number="#T-1021"
                      title="Bug report"
                      priority="High"
                      status="Resolved"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 top-0 z-20 w-56 rounded-2xl border border-purple-200 bg-white p-5 shadow-xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-purple-700">
                <Sparkles className="h-4 w-4" />
                AI Suggests
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p>• Category: Billing</p>
                <p>• Priority: High</p>
                <p>• Suggested Response</p>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-100 bg-white shadow-xl">
              <BarChart3 className="h-10 w-10 text-indigo-500" />
            </div>

            <div className="absolute bottom-0 left-4 z-20 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>

              <div>
                <p className="text-sm font-bold">Support Team</p>
                <p className="text-xs text-slate-500">
                  Resolving tickets faster
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-purple-50 bg-[#f8f7fc] py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Sparkles />}
              title="AI-Powered Assistance"
              description="Automatic categorization, priority suggestions, response drafts and more."
              iconClass="bg-pink-100 text-pink-600"
            />

            <FeatureCard
              icon={<Users />}
              title="Role-Based Access"
              description="Tailored experiences for customers, agents, developers and admins."
              iconClass="bg-emerald-100 text-emerald-600"
            />

            <FeatureCard
              icon={<MessageSquare />}
              title="Real-Time Collaboration"
              description="Instant messaging, internal notes and live updates via Socket.IO."
              iconClass="bg-blue-100 text-blue-600"
            />

            <FeatureCard
              icon={<BarChart3 />}
              title="Track & Improve"
              description="Monitor SLA, performance and generate insightful reports."
              iconClass="bg-orange-100 text-orange-600"
            />
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h2 className="text-3xl font-bold text-[#111a4d]">
            Everything your support team needs
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            SupportHub brings customers, support agents, developers and
            administrators together in one intelligent ticket management
            platform.
          </p>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#151d5b] py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2 font-bold">
            <Ticket className="h-5 w-5" />
            SupportHub
          </div>

          <p className="text-sm text-indigo-200">
            Intelligent support. Better experiences.
          </p>
        </div>
      </footer>

      {activeModal === "login" && (
        <Modal
          title="Welcome Back"
          subtitle="Login to access your support account."
          onClose={() => setActiveModal(null)}
        >
          <AuthForm
            mode="login"
            onSubmit={() => {
              setActiveModal(null);
              router.push("/dashboard");
            }}
          />
        </Modal>
      )}

      {activeModal === "register" && (
        <Modal
          title="Create an Account"
          subtitle="Create an account to raise and track support tickets."
          onClose={() => setActiveModal(null)}
        >
          <AuthForm
            mode="register"
            onSubmit={() => {
              setActiveModal(null);
              router.push("/dashboard");
            }}
          />
        </Modal>
      )}
    </main>
  );
}

interface TicketRowProps {
  number: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
}

function TicketRow({ number, title, priority, status }: TicketRowProps) {
  const priorityClass = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-orange-50 text-orange-500",
    Low: "bg-emerald-50 text-emerald-600",
  };

  const statusClass = {
    Open: "bg-blue-50 text-blue-500",
    "In Progress": "bg-purple-50 text-purple-600",
    Resolved: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3">
      <div>
        <p className="text-[10px] text-slate-400">{number}</p>
        <p className="text-xs font-semibold text-slate-700">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${priorityClass[priority]}`}
        >
          {priority}
        </span>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
}

function FeatureCard({
  icon,
  title,
  description,
  iconClass,
}: FeatureCardProps) {
  return (
    <div>
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconClass}`}
      >
        <div className="h-6 w-6">{icon}</div>
      </div>

      <h3 className="text-lg font-bold text-[#111a4d]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
