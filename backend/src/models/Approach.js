import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Approach = sequelize.define("Approach", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM("brute", "better", "optimal"), allowNull: false },
  code: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false, defaultValue: "javascript" },
  timeComplexity: { type: DataTypes.STRING, allowNull: true },
  spaceComplexity: { type: DataTypes.STRING, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: "approaches", timestamps: true });
