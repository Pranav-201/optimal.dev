import { sequelize } from "../config/db.js";
import { Day } from "./Day.js";
import { Problem } from "./Problem.js";
import { Approach } from "./Approach.js";
import { Summary } from "./Summary.js";

Day.hasMany(Problem, { foreignKey: "dayId", onDelete: "CASCADE" });
Problem.belongsTo(Day, { foreignKey: "dayId" });

Problem.hasMany(Approach, { foreignKey: "problemId", onDelete: "CASCADE" });
Approach.belongsTo(Problem, { foreignKey: "problemId" });

export const syncDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

export { sequelize, Day, Problem, Approach, Summary };
