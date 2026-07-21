"use client";

import { useTodos } from "./hooks/useTodo";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Loader from "./components/Loader";

export default function Home() {
  const {
    todos,
    loading,
    error,
    actionError,
    savingId,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    clearActionError,
  } = useTodos();

  if (loading) return <Loader />;
  if (error) throw new Error(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-orange-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
          ✨ Todo CRUD App
        </h1>

        {actionError && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-rose-100 border-2 border-rose-200 px-4 py-3 text-sm text-rose-700">
            <span>{actionError}</span>
            <button onClick={clearActionError} className="font-bold">
              ✕
            </button>
          </div>
        )}

        <TodoForm onAdd={addTodo} />
        <TodoList
          todos={todos}
          savingId={savingId}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={removeTodo}
        />
      </div>
    </div>
  );
}
