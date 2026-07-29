// components/FeedbackWidget.jsx
"use client";

import { useState } from "react";
import { recordFeedback } from "../app/documentation/[framework]/[slug]/action";

export default function FeedbackWidget({ framework, slug }) {
  const [submitted, setSubmitted] = useState(false);

  async function handleFeedback(helpful) {
    await recordFeedback(framework, slug, helpful);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-emerald-600">Thanks for your feedback!</p>
    );
  }

  return (
    <div className="border-t border-slate-100 pt-4 mt-8">
      <p className="text-sm font-medium text-slate-700 mb-2">
        Was this helpful?
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback(true)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          👍 Yes
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          👎 No
        </button>
      </div>
    </div>
  );
}
