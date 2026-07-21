"use client";

import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../../lib/api";
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  function loadTodos() {
    setLoading(true);
    setError(null);
    getTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(title) {
    setActionError(null);
    try {
      const created = await createTodo(title);
      setTodos((prev) => [...prev, created]);
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function toggleTodo(todo) {
    setActionError(null);
    setSavingId(todo.id);
    try {
      const updated = await updateTodo(todo.id, { done: !todo.done });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function editTodo(id, title) {
    setActionError(null);
    setSavingId(id);
    try {
      const updated = await updateTodo(id, { title });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function removeTodo(id) {
    setActionError(null);
    setSavingId(id);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  return {
    todos,
    loading,
    error,
    actionError,
    savingId,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    clearActionError: () => setActionError(null),
  };
}
