import { FiZap } from "react-icons/fi";

export default function AgentAssistance({
  user,
  aiDraft,
  aiDraftUsed,
  regenerateDraft,
  loading,
}) {
  return (
    <>
      {user?.role === "SupportAgent" && aiDraft && (
        <div className="mx-4 mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-indigo-900">
              <FiZap />
              AI Reply Draft
            </div>

            <span className="text-xs text-indigo-700">
              Confidence: {Math.round(aiDraft.confidence * 100)}%
            </span>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {aiDraft.suggestedResponse}
          </p>

          {aiDraft.escalationRecommended && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">Escalation recommended</p>
              {aiDraft.escalationReason && (
                <p className="mt-1">{aiDraft.escalationReason}</p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={aiDraftUsed}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Use this draft
            </button>

            <button
              type="button"
              onClick={regenerateDraft}
              disabled={loading}
              className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </>
  );
}
