import express, { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} from "./project.service";
import { Project, CreateProjectBody } from "../../types";

const route = express.Router();

route.get("/projects", (req: Request, res: Response) => {
  res.json(getAllProjects());
});

route.get("/projects/:id", (req: Request<{ id: string }>, res: Response) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(project);
});

route.delete("/projects/:id", (req: Request<{ id: string }>, res: Response) => {
  const deleted = deleteProject(req.params.id);
  res.status(deleted ? 204 : 404).send();
});

route.post(
  "/projects",
  (req: Request<{}, Project, CreateProjectBody>, res: Response) => {
    const project = createProject(req.body);
    res.status(201).json(project);
  },
);

export default route;
