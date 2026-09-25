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

export const formatHours = (hours: number) => {
  if (hours < 24) {
    return `${hours.toFixed(1)} hrs`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);

  return `${days}d ${remainingHours}h`;
};

export function formatMessageDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatMessageTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getMessageDateKey(date: string | Date) {
  const messageDate = new Date(date);

  return [
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate(),
  ].join("-");
}
