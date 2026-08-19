import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
    },
    genre: {
      type: DataTypes.STRING(50),
    },
    published_year: {
      type: DataTypes.SMALLINT,
    },
    copies_available: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "books",
    timestamps: false,
  },
);
