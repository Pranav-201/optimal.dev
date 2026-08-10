import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Day = sequelize.define("Day", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dayNumber: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { 
  tableName: "days", 
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["dayNumber", "userId"]
    }
  ]
});
