export function getTicketStatusClass(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-700";

    case "IN_PROGRESS":
      return "bg-indigo-100 text-indigo-700";

    case "ESCALATED":
      return "bg-orange-100 text-orange-700";

    case "IN_DEVELOPMENT":
      return "bg-purple-100 text-purple-700";

    case "RESOLVED":
      return "bg-emerald-100 text-emerald-700";

    case "CLOSED":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};
