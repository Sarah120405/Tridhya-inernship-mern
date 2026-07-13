import type { Project, CreateProjectBody } from "../type.ts";

const BASE_URL = "http://localhost:3000/projects";

export async function getAllProjects(): Promise<Project[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
}

export async function getTakById(id: string): Promise<Project> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
}
export async function createProject(data: CreateProjectBody): Promise<Project> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create project");
  }
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete project");
  }
}
