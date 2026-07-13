import { useState, useEffect } from "react";
import type { Task } from "../type";
import { getAllTasks, deleteTask, updateTask } from "../api/taskApi";
import EntityForm from "../components/taskForm";
import Modal from "../components/Modal";
import ActionsMenu from "../components/ActionsMenu";
import "../components/dashboard.css";

interface TaskListProps {
  projectId: string;
  onBack: () => void;
}

export default function TaskList({ projectId, onBack }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setForm] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        const data = await getAllTasks(projectId);
        setTasks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [projectId]);

  function priorityBadge(priority: Task["priority"]) {
    return <span className={`badge priority-${priority}`}>{priority}</span>;
  }

  function statusBadge(status: Task["status"]) {
    return (
      <span className={`badge badge-${status.status}`}>
        {renderStatus(status)}
      </span>
    );
  }
  function getNextStatus(current: Task["status"]): Task["status"] {
    switch (current.status) {
      case "todo":
        return { status: "inProgress", progressPercent: 0 };
      case "inProgress":
        return { status: "completed", completeDate: new Date() };
      case "completed":
        return { status: "todo" };
      default: {
        const exhaustiveCheck: never = current;
        return exhaustiveCheck;
      }
    }
  }
  async function handleUpdateStatus(task: Task) {
    const nextStatus = getNextStatus(task.status);
    try {
      const updated = await updateTask(task.id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }

  function renderStatus(status: Task["status"]): string {
    switch (status.status) {
      case "todo":
        return "To Do";
      case "inProgress":
        return `In Progress (${status.progressPercent}%)`;
      case "completed":
        return `Completed on ${new Date(status.completeDate).toLocaleDateString()}`;
      default: {
        const exhaustiveCheck: never = status;
        return exhaustiveCheck;
      }
    }
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

  const completedCount = tasks.filter(
    (t) => t.status.status === "completed",
  ).length;

  return (
    <div className="dashboard">
      <button className="btn-back" onClick={onBack}>
        ← Back to Projects
      </button>

      <div className="dashboard-header">
        <div>
          <h1>Tasks</h1>
          <p>Tasks for this project</p>
        </div>
        <button className="btn-primary" onClick={() => setForm(!openForm)}>
          + Add Task
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Tasks</div>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completedCount}</div>
        </div>
      </div>

      {openForm && (
        <Modal title="Add Task" onClose={() => setForm(false)}>
          <EntityForm
            mode="task"
            projectId={projectId}
            onCreated={(task) => {
              setTasks((prev) => [...prev, task]);
              setForm(false);
            }}
          />
        </Modal>
      )}

      <div className="table-wrapper" style={{ marginTop: "16px" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4}>No tasks for this project yet.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{priorityBadge(task.priority)}</td>
                  <td>{statusBadge(task.status)}</td>
                  <td>
                    <ActionsMenu
                      onDelete={() => handleDelete(task.id)}
                      onUpdateStatus={() => handleUpdateStatus(task)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
