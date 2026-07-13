import express, { NextFunction, Request, Response } from "express";
import projectRoute from "./modules/Project/project.route";
import taskRoute from "./modules/Tasks/task.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(projectRoute);
app.use(taskRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON payload. Please send a valid JSON body.",
    });
  }

  next(err);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
