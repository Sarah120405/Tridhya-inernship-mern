"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  function loadTodos() {
    setLoading(true);
    setError(null);
    fetch("/api/todos")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (res.ok) {
      const created = await res.json();
      setTodos((prev) => [...prev, created]);
      setNewTitle("");
    }
  }

  async function handleToggleDone(todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
  }

  async function handleSaveEdit(id) {
    if (!editingTitle.trim()) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle }),
    });

    if (res.ok) {
      const updated = await res.json();
      console.log(updated);

      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingId(null);
      setEditingTitle("");
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-fuchsia-50 to-orange-100">
        <p className="text-lg font-semibold text-violet-600">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-fuchsia-50 to-orange-100">
        <p className="text-lg font-semibold text-rose-600">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-orange-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
          ✨ Todo CRUD App
        </h1>

        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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

        <ul className="flex flex-col gap-3">
          {todos.length === 0 && (
            <li className="text-center text-violet-400 font-medium py-8">
              No todos yet — add one above! 🎉
            </li>
          )}

          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 rounded-2xl p-4 shadow-sm border-2 transition ${
                todo.done
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-violet-100"
              }`}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggleDone(todo)}
                className="w-5 h-5 rounded-full accent-fuchsia-500 cursor-pointer shrink-0"
              />

              {editingId === todo.id ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 rounded-lg border-2 border-fuchsia-200 px-3 py-1.5 text-sm outline-none focus:border-fuchsia-400"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(todo.id)}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm font-medium ${
                      todo.done
                        ? "line-through text-emerald-600"
                        : "text-slate-700"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                    className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition"
                  >
                    Edit
                  </button>
                </>
              )}

              <button
                onClick={() => handleDelete(todo.id)}
                className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-200 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
