"use client";

import { useTransition } from "react";
import { refreshISRPage } from "../app/rendering-demo/isr/action";

export default function RefreshButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await refreshISRPage();
      window.location.reload();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="mt-4 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
    >
      {isPending ? "Refreshing..." : "Force Refresh Now"}
    </button>
  );
}
