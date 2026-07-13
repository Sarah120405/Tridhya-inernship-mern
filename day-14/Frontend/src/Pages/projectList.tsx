import { useState, useEffect } from "react";
import type { Project } from "../type";
import { getAllProjects, deleteProject } from "../api/projectApi";
import EntityForm from "../components/taskForm";
import "../components/dashboard.css";
import Modal from "../components/Modal";

interface ProjectListProps {
  onSelectProject: (id: string) => void;
}
export default function ProjectList({ onSelectProject }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setForm] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  }

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your projects</p>
        </div>
        <button className="btn-primary" onClick={() => setForm(!openForm)}>
          + Add Project
        </button>
        {openForm && (
          <Modal title="Add Project" onClose={() => setForm(false)}>
            <EntityForm
              mode="project"
              onCreated={(project) => {
                setProjects((prev) => [...prev, project]);
                setForm(false);
              }}
            />
          </Modal>
        )}
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{projects.length}</div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} onClick={() => onSelectProject(project.id)}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>
                <button
                  className="btn-back"
                  onClick={(e) => handleDelete(e, project.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
