import { TicketActivityUser } from "../store/slice/activitySlice";

export function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export const formatActivityDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRole = (role: TicketActivityUser["role"]) => {
  switch (role) {
    case "SupportAgent":
      return "Support Agent";

    case "Developer":
      return "Developer";

    case "Customer":
      return "Customer";

    case "Admin":
      return "Administrator";

    default:
      return role;
  }
};
