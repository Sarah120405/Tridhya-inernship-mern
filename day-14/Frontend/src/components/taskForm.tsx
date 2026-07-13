import { useState } from "react";
import type {
  CreateTaskBody,
  CreateProjectBody,
  TaskState,
  Task,
  Project,
} from "../type";
import { createTask } from "../api/taskApi";
import { createProject } from "../api/projectApi";

type EntityForm =
  | { mode: "task"; projectId: string; onCreated: (task: Task) => void }
  | { mode: "project"; onCreated: (project: Project) => void };

function EntityForm(props: EntityForm) {
  const [title, setTitle] = useState(""); // used for Task.title
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low"); // Task only
  const [name, setName] = useState(""); // used for Project.name
  const [description, setDescription] = useState(""); // Project only

  function handleTextChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: (value: string) => void,
  ) {
    setter(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (props.mode === "task") {
      const trimmedTitle = title.trim();
      if (!trimmedTitle || !props.projectId.trim()) {
        alert("Add data to form");
        return;
      }

      const data: CreateTaskBody = {
        title: trimmedTitle,
        priority,
        status: { status: "todo" } as TaskState,
        projectId: props.projectId.trim(),
      };
      const created = await createTask(data);
      props.onCreated(created);
      setTitle("");
      setPriority("low");
    } else {
      const trimmedName = name.trim();
      const trimmedDescription = description.trim();
      if (!trimmedName || !trimmedDescription) {
        alert("Add data to form");
        return;
      }

      const data: CreateProjectBody = {
        name: trimmedName,
        description: trimmedDescription,
      };
      const created = await createProject(data);
      props.onCreated(created);
      setName("");
      setDescription("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {props.mode === "task" ? (
        <>
          <div className="form-field">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => handleTextChange(e, setTitle)}
            />
          </div>
          <div className="form-field">
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="form-field">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => handleTextChange(e, setName)}
            />
          </div>
          <div className="form-field">
            <label>Description</label>
            <input
              value={description}
              onChange={(e) => handleTextChange(e, setDescription)}
            />
          </div>
        </>
      )}
      <button type="submit" className="btn-primary">
        Submit
      </button>
    </form>
  );
}

export default EntityForm;
