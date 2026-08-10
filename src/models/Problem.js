import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Problem = sequelize.define("Problem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: true },
  difficulty: { type: DataTypes.ENUM("Easy", "Medium", "Hard"), allowNull: false, defaultValue: "Medium" },
  pattern: { type: DataTypes.STRING, allowNull: true },
  timerSeconds: { type: DataTypes.INTEGER, allowNull: true },
  timerStartedAt: { type: DataTypes.DATE, allowNull: true },
  timerStoppedAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: "problems", timestamps: true });
