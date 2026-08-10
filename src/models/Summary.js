import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Summary = sequelize.define("Summary", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM("daily", "weekly", "monthly"), allowNull: false },
  refKey: { type: DataTypes.STRING, allowNull: false }, // e.g. "5" for day, "2026-W32" for week, "2026-08" for month
  content: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: "summaries", timestamps: true });
