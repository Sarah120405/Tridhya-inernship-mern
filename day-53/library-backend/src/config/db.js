import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
}
