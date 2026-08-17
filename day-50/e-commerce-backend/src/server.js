import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import index_api from "./index_api.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";

/* import morgan from "morgan";

const logStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});
 */
dotenv.config();

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
/* app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev")); */
app.use("/api", index_api);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
