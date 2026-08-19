import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const BorrowRecord = sequelize.define(
  "BorrowedRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
    },
    member_id: {
      type: DataTypes.INTEGER,
    },
    borrowed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    return_date: {
      type: DataTypes.DATE,
    },
    returned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "borrow_records",
    timestamps: false,
  },
);
