import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import index_api from "./index_api.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api", index_api);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
