import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Author = sequelize.define(
  "Author",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "authors",
    timestamps: false,
  },
);
