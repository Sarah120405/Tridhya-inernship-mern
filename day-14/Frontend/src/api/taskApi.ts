import type { Task, CreateTaskBody } from "../type.ts";

const BASE_URL = "http://localhost:3000/tasks";

export async function getAllTasks(projectId: string): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}?projectId=${projectId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function getTakById(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}
export async function createTask(data: CreateTaskBody): Promise<Task> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
}

export async function updateTask(
  id: string,
  data: Partial<CreateTaskBody>,
): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  return res.json();
}
