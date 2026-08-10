import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Day } from "./Day.js";
import { Problem } from "./Problem.js";
import { Approach } from "./Approach.js";
import { Summary } from "./Summary.js";

// User associations
User.hasMany(Day, { foreignKey: "userId", onDelete: "CASCADE" });
Day.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Summary, { foreignKey: "userId", onDelete: "CASCADE" });
Summary.belongsTo(User, { foreignKey: "userId" });

// Day & Problem associations
Day.hasMany(Problem, { foreignKey: "dayId", onDelete: "CASCADE" });
Problem.belongsTo(Day, { foreignKey: "dayId" });

Problem.hasMany(Approach, { foreignKey: "problemId", onDelete: "CASCADE" });
Approach.belongsTo(Problem, { foreignKey: "problemId" });

export const syncDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};

export { sequelize, User, Day, Problem, Approach, Summary };
