"use client";
import { useState } from "react";

export default function TodoItem({
  todo,
  isSaving,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  function handleSave() {
    if (!editTitle.trim()) return;
    onEdit(todo.id, editTitle);
    setIsEditing(false);
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl p-4 shadow-sm border-2 transition ${
        todo.done
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-violet-100"
      }`}
    >
      <input
        type="checkbox"
        checked={todo.done}
        disabled={isSaving}
        onChange={() => onToggle(todo)}
        className="w-5 h-5 rounded-full accent-fuchsia-500 cursor-pointer shrink-0 disabled:opacity-50"
      />

      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 rounded-lg border-2 border-fuchsia-200 px-3 py-1.5 text-sm outline-none focus:border-fuchsia-400"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-300 transition"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            className={`flex-1 text-sm font-medium ${todo.done ? "line-through text-emerald-600" : "text-slate-700"}`}
          >
            {todo.title}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition"
          >
            Edit
          </button>
        </>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        disabled={isSaving}
        className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-200 transition disabled:opacity-50"
      >
        Delete
      </button>
    </li>
  );
}
