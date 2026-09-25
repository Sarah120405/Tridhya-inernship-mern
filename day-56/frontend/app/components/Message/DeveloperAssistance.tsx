import { FiRefreshCw, FiZap } from "react-icons/fi";

export default function DeveloperAssistance({
  user,
  loading,
  developerAssistance,
  developerAssistanceError,
  fetchDeveloperAssistance,
}) {
  return (
    <>
      {user?.role === "Developer" && (
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Technical Summary
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Technical handoff generated from the ticket conversation
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDeveloperAssistance}
              disabled={loading}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap />
                  Generate Summary
                </>
              )}
            </button>
          </div>

          {developerAssistanceError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {developerAssistanceError}
            </div>
          )}

          {developerAssistance && (
            <div>
              <div className="mt-4 max-h-[300px] space-y-4 overflow-y-auto rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Issue Summary
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {developerAssistance.issueSummary}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Observed Behavior
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {developerAssistance.observedBehavior}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Troubleshooting Attempted
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {developerAssistance.troubleshootingAttempted}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Relevant Technical Details
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {developerAssistance.relevantTechnicalDetails}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Customer Impact
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {developerAssistance.customerImpact}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-indigo-900">
                    Developer Investigation
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {developerAssistance.developerInvestigation}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-indigo-100 pt-3">
                <span className="text-xs font-medium text-slate-500">
                  AI Confidence
                </span>

                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {Math.round(developerAssistance.confidence * 100)}%
                </span>
              </div>
              <button
                type="button"
                onClick={fetchDeveloperAssistance}
                disabled={loading}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
              >
                Regenerate Summary
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
