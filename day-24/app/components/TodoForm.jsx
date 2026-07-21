"use client";
import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        className="flex-1 rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100 transition"
      />
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
      >
        Add
      </button>
    </form>
  );
}
