type ToDo = { status: "todo" };
type Progress = { status: "inProgress"; progressPercent: number };
type Complete = { status: "completed"; completeDate: Date };

type TaskState = ToDo | Progress | Complete;
type Priority = "low" | "medium" | "high";
interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskState;
  projectId: string;
}
interface Project {
  id: string;
  name: string;
  description: string;
}

let tasks: Task[] = [];
let projects: Project[] = [];

export type CreateTaskBody = Omit<Task, "id">;
export type CreateProjectBody = Omit<Project, "id">;

export type { TaskState, Task, Priority, Project };
export { tasks, projects };
