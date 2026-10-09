import { TicketActivity } from "../store/slice/activitySlice";

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

export const formatActivityAction = (action: string) => {
  switch (action) {
    case "TICKET_CREATED":
      return "Ticket Created";

    case "AGENT_ASSIGNED":
      return "Agent Assigned";

    case "AGENT_REASSIGNED":
      return "Agent Reassigned";

    case "DEVELOPER_ASSIGNED":
      return "Developer Assigned";

    case "DEVELOPER_REASSIGNED":
      return "Developer Reassigned";

    case "DEVELOPER_UPDATED":
      return "Developer Updated";

    case "TICKET_RESOLVED":
      return "Ticket Resolved";

    case "TICKET_CLOSE":
      return "Ticket Closed";

    case "STATUS_CHANGED":
      return "Ticket Reopened";
    default:
      return action
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

export const getActivityDescription = (activity: TicketActivity) => {
  switch (activity.action) {
    case "TICKET_CREATED":
      return "This ticket was created.";

    case "AGENT_ASSIGNED":
      return "A support agent was assigned to this ticket.";

    case "AGENT_REASSIGNED":
      return "The support agent assigned to this ticket was changed.";

    case "DEVELOPER_ASSIGNED":
      return "A developer was assigned to this ticket.";

    case "DEVELOPER_REASSIGNED":
      return "The developer assigned to this ticket was changed.";

    case "DEVELOPER_UPDATED":
      return "The developer updated the ticket.";

    case "TICKET_RESOLVED":
      return "This ticket was marked as resolved.";

    case "TICKET_CLOSE":
      return "This ticket was closed by the customer";

    case "STATUS_CHANGED":
      return "This ticket was reopened and moved back to in progress.";

    default:
      return "Ticket activity was updated.";
  }
};

export const getOverallSLAStatus = (
  firstResponse: TargetStatus,
  resolution: TargetStatus,
) => {
  const statuses = [firstResponse, resolution].filter(
    (status) => status !== "NOT_APPLICABLE",
  );

  if (statuses.length === 0) return "NOT_APPLICABLE";

  if (statuses.includes("BREACHED")) return "BREACHED";

  if (statuses.every((status) => status === "COMPLETED")) {
    return "COMPLETED";
  }

  if (statuses.includes("AT_RISK")) return "AT_RISK";

  return "ON_TRACK";
};

type TargetStatus =
  | "COMPLETED"
  | "BREACHED"
  | "AT_RISK"
  | "ON_TRACK"
  | "NOT_APPLICABLE";

export const getStatusClasses = (status: TargetStatus | string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "BREACHED":
      return "bg-red-100 text-red-700";
    case "AT_RISK":
      return "bg-yellow-100 text-yellow-700";
    case "ON_TRACK":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
