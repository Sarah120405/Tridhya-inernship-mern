import express from "express";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import index_api from "./index_api";
import { errorHandler } from "./middleware/error.middleware";
import { startSlaMonitoring } from "./jobs/sla_monitor.job";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", index_api);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSlaMonitoring();
});
