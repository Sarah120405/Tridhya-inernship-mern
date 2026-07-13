import { tasks, CreateTaskBody, Task } from "../../types";

export function getAllTasks(): Task[] {
  return tasks;
}

export function getTaskById(id: string): Task | undefined {
  const task = tasks.find((t) => t.id === id);
  return task;
}

export function createTask(data: CreateTaskBody): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    ...data,
  };

  tasks.push(task);
  return task;
}

export function deleteTask(id: string): boolean {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return false;
  }
  tasks.splice(taskIndex, 1);
  return true;
}

export function updateTask(
  id: string,
  data: Partial<CreateTaskBody>,
): Task | undefined {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return undefined;
  }

  const existingTask = tasks[taskIndex];
  if (!existingTask) {
    return undefined;
  }

  const updatedTask: Task = {
    id: existingTask.id,
    title: data.title ?? existingTask.title,
    priority: data.priority ?? existingTask.priority,
    status: data.status ?? existingTask.status,
    projectId: data.projectId ?? existingTask.projectId,
  };

  tasks[taskIndex] = updatedTask;
  return updatedTask;
}
