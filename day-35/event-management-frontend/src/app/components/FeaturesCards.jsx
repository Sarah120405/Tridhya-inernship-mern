import { Compass, CalendarCheck, ShieldCheck, Ticket } from "lucide-react";

const features = [
  {
    icon: Compass,
    color: "bg-purple-600",
    title: "Discover Events",
    desc: "Explore a wide range of events tailored to your interests.",
  },
  {
    icon: CalendarCheck,
    color: "bg-pink-500",
    title: "Easy Booking",
    desc: "Book your favorite events in just a few clicks.",
  },
  {
    icon: ShieldCheck,
    color: "bg-orange-400",
    title: "Secure Payments",
    desc: "Enjoy safe and secure transactions every time.",
  },
  {
    icon: Ticket,
    color: "bg-emerald-500",
    title: "Instant Tickets",
    desc: "Get your tickets instantly and enjoy hassle-free entry.",
  },
];

export default function FeatureCards() {
  return (
    <section className="max-w-7xl mx-auto w-full px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map(({ icon: Icon, color, title, desc }) => (
        <div
          key={title}
          className="border rounded-2xl p-5 bg-white dark:bg-zinc-900"
        >
          <div
            className={`w-9 h-9 rounded-full ${color} flex items-center justify-center mb-3`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          <p className="text-xs text-zinc-500">{desc}</p>
        </div>
      ))}
    </section>
  );
}
