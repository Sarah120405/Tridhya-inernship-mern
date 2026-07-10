import { Project, CreateProjectBody } from "../../types";
import { projects } from "../../types";

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  const project = projects.find((p) => p.id === id);
  return project;
}

export function createProject(data: CreateProjectBody): Project {
  const project: Project = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
  };

  projects.push(project);
  return project;
}

export function deleteProject(id: string): boolean {
  const projectIndex = projects.findIndex((p) => p.id === id);
  if (projectIndex === -1) {
    return false;
  }
  projects.splice(projectIndex, 1);
  return true;
}
