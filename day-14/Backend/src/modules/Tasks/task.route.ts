import express, { Request, Response } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "./task.service";
import { Task, CreateTaskBody } from "../../types";

const route = express.Router();

route.get("/tasks", (req: Request, res: Response) => {
  res.json(getAllTasks());
});

route.get("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(task);
});

route.delete("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const deleted = deleteTask(req.params.id);
  res.status(deleted ? 204 : 404).send();
});

route.post(
  "/tasks",
  (req: Request<{}, Task, CreateTaskBody>, res: Response) => {
    const task = createTask(req.body);
    res.status(201).json(task);
  },
);

route.patch(
  "/tasks/:id",
  (req: Request<{ id: string }, Task, Partial<CreateTaskBody>>, res: Response) => {
    const task = updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json(task);
  },
);
export default route;
