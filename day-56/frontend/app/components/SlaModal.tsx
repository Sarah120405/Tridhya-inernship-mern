import Modal from "./Modal";
import { formatDate } from "../utils/date";
import { getTargetStatus } from "../dashboard/sla/page";
import {
  FiBell,
  FiCheckSquare,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";

function SLAField({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  const isUnavailable =
    !value || value === "N/A" || value === "Invalid Date" || value === "—";

  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p
        className={`break-words font-medium sm:max-w-[60%] sm:text-right ${
          isUnavailable ? "text-xs text-slate-400" : "text-sm text-slate-800"
        } ${valueClassName}`}
      >
        {isUnavailable ? "Unavailable" : value}
      </p>
    </div>
  );
}

export default function SlaModal({
  selectedSLA,
  isSlaDetailsLoading,
  slaDetails,
  slaDetailsError,
  setIsSlaModalOpen,
  setSelectedSLA,
  setSlaDetails,
  setSlaDetailsError,
  handleOpenSLAModal,
}) {
  console.log("SlaModal selectedSLA:", selectedSLA);
  return (
    <Modal
      title={`SLA Details — #${selectedSLA.ticket.ticketNumber}`}
      subtitle={selectedSLA.ticket.title}
      onClose={() => {
        setIsSlaModalOpen(false);
        setSelectedSLA(null);
        setSlaDetails(null);
        setSlaDetailsError("");
      }}
    >
      {isSlaDetailsLoading ? (
        <div className="py-10 text-center text-sm text-slate-500">
          Loading SLA details...
        </div>
      ) : slaDetailsError ? (
        <div className="space-y-4 rounded-xl border border-red-200 bg-red-50/70 p-4">
          <p className="text-sm text-red-700">{slaDetailsError}</p>

          <button
            onClick={() => handleOpenSLAModal(selectedSLA)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      ) : slaDetails ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiMessageSquare size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    First Response SLA
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                <SLAField
                  label="Status"
                  value={getTargetStatus(
                    slaDetails.firstRespondedAt,
                    slaDetails.firstResponseDueAt,
                    slaDetails.createdAt,
                  ).replace("_", " ")}
                />

                <SLAField
                  label="Due At"
                  value={formatDate(slaDetails.firstResponseDueAt)}
                />

                <SLAField
                  label="First Responded At"
                  value={formatDate(slaDetails.firstRespondedAt)}
                />
              </div>
            </section>

            {/* Resolution SLA */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FiCheckSquare size={18} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Resolution SLA
                  </h4>
                </div>
              </div>
              <div className="space-y-3">
                <SLAField
                  label="Status"
                  value={getTargetStatus(
                    slaDetails.resolutionCompletedAt,
                    slaDetails.resolutionDueAt,
                    slaDetails.createdAt,
                  ).replace("_", " ")}
                />

                <SLAField
                  label="Due At"
                  value={formatDate(slaDetails.resolutionDueAt)}
                />

                <SLAField
                  label="Completed At"
                  value={formatDate(slaDetails.resolutionCompletedAt)}
                />
              </div>
            </section>

            {/* Breach information */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FiShield />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Breach Information
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                <SLAField
                  label="Overall Breached Flag"
                  value={slaDetails.breached ? "Yes" : "No"}
                  valueClassName={
                    slaDetails.breached ? "text-red-600" : "text-emerald-600"
                  }
                />

                <SLAField
                  label="Breach Recorded At"
                  value={formatDate(slaDetails.breachedAt)}
                />
              </div>
            </section>

            {/* Warning notifications */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <FiBell size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Warning Notifications
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                <SLAField
                  label="First Response Warning"
                  value={formatDate(slaDetails.firstResponseWarningSentAt)}
                />

                <SLAField
                  label="Resolution Warning"
                  value={formatDate(slaDetails.resolutionWarningSentAt)}
                />
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
