import { useState } from "react";
import { Ticket } from "../../store/slice/ticketSlice";
import { User } from "../../store/slice/userSlice";

interface TicketAssignmentProps {
  ticket: Ticket;
  user: User | null;
  agents: User[];
  developers: User[];
  isAssigning: boolean;
  onAssign: (developerId: string) => void;

  isAssigningAgent: boolean;
  onAgentAssign: (agentId: string) => void;
}
export default function TicketAssignment({
  ticket,
  user,
  agents,
  developers,
  isAssigning,
  onAssign,
  isAssigningAgent,
  onAgentAssign,
}: TicketAssignmentProps) {
  const [selectedDeveloperId, setSelectedDeveloperId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  return (
    <>
      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <p className="text-xs font-medium text-slate-500">Customer</p>
          <p className="mt-1 font-semibold text-slate-800">
            {ticket.customer?.name ?? ticket.customerId ?? "Not available"}
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Assigned Agent
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {ticket.assignedAgent?.name ??
                  ticket.assignedAgentId ??
                  "Not assigned"}
              </p>
            </div>
            {user?.role === "Admin" && !ticket.assignedAgentId && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  disabled={isAssigningAgent}
                  className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="">Select Support Agent</option>

                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!selectedAgentId || isAssigningAgent}
                  onClick={() => onAgentAssign(selectedAgentId)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAssigningAgent ? "Assigning..." : "Assign Support Agent"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Developer */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Assigned Developer
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {ticket.assignedDeveloper?.name ?? "Not assigned"}
              </p>
            </div>

            {(user?.role === "SupportAgent" || user?.role === "Admin") &&
              !ticket.assignedDeveloperId && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={selectedDeveloperId}
                    onChange={(e) => setSelectedDeveloperId(e.target.value)}
                    disabled={isAssigning}
                    className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">Select developer</option>

                    {developers.map((developer) => (
                      <option key={developer.id} value={developer.id}>
                        {developer.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={!selectedDeveloperId || isAssigning}
                    onClick={() => onAssign(selectedDeveloperId)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAssigning ? "Assigning..." : "Assign Developer"}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
