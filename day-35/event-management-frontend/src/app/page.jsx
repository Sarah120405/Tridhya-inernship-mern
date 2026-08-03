"use client";
import { useState } from "react";
import Modal from "./components/Modal";
import AuthForm from "./components/AuthForm";
import { useRouter } from "next/navigation";
import FeatureCards from "./components/FeaturesCards";
import { Sparkles, Users, UserCog, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Sparkles, value: "10K+", label: "Events" },
  { icon: Users, value: "500K+", label: "Happy Users" },
  { icon: UserCog, value: "25K+", label: "Organizers" },
  { icon: ShieldCheck, value: "99.9%", label: "Secure Bookings" },
];

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const router = useRouter();
  return (
    <div className="mx-auto w-full flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <header className="flex items-center justify-between px-8 py-5 border-b border-purple-200 dark:border-zinc-700 mx-auto w-full">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Eventora
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal("login")}
            className="text-sm font-medium px-4 py-2 rounded-full border hover:bg-zinc-50"
          >
            Log in
          </button>
          <button
            onClick={() => setActiveModal("register")}
            className="text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            Sign up
          </button>
        </div>
      </header>
      <section className="max-w-7xl mx-auto w-full px-8 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight text-zinc-900 dark:text-white">
            Discover. Book.
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Experience.
            </span>
          </h1>
          <p className="mt-4 text-zinc-500 max-w-sm">
            Find and manage events that create lasting memories. From concerts
            to conferences, we've got you covered.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="px-5 py-3 rounded-full text-white font-medium bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
              Explore Events →
            </button>
            <button className="px-5 py-3 rounded-full font-medium border hover:bg-zinc-50">
              Create Event
            </button>
          </div>
        </div>

        {/* Diagonal photo collage — this is the signature visual element */}
        <div className="relative h-96 hidden md:block">
          <div
            className="absolute top-0 left-14 w-56 rounded-xl h-60 bg-zinc-800 overflow-hidden"
            style={{ clipPath: "polygon(10% 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <img
              src="/images/dashboard-3.jpg"
              alt="Concert crowd"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute top-15 right-12 rounded-xl w-66 h-70 bg-zinc-800 overflow-hidden"
            style={{ clipPath: "polygon(15% 0, 100% 10%, 100% 100%, 0% 100%)" }}
          >
            <img
              src="/images/dashboard-1.jpg"
              alt="Conference speaker"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute top-65 left-8 w-50 h-40 bg-zinc-800 overflow-hidden"
            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <img
              src="/images/dashboard-2.webp"
              alt="Audience"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-6 right-10 w-32 h-32 rounded-full bg-purple-400/40 blur-2xl z-10" />
          <div className="absolute -bottom-8 left-40 w-36 h-36 rounded-full bg-pink-400/40 blur-2xl z-10" />
        </div>
      </section>

      <FeatureCards />
      <section className="max-w-7xl mx-auto w-full px-8 pb-12">
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white grid grid-cols-2 md:grid-cols-4 gap-6 px-8 py-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-6 h-6 opacity-80" />
              <div>
                <div className="font-bold text-lg leading-none">{value}</div>
                <div className="text-xs opacity-80">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {activeModal === "login" && (
        <Modal title="Log In" onClose={() => setActiveModal(null)}>
          <AuthForm
            mode="login"
            onSuccess={() => {
              setActiveModal(null);
              router.push("/dashboard");
            }}
          />
        </Modal>
      )}

      {activeModal === "register" && (
        <Modal title="Register" onClose={() => setActiveModal(null)}>
          <AuthForm
            mode="register"
            onSuccess={() => {
              setActiveModal(null);
              router.push("/login");
            }}
          />
        </Modal>
      )}
    </div>
  );
}
