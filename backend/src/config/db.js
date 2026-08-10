import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT || "mysql";

export const sequelize =
  dialect === "sqlite"
    ? new Sequelize({
        dialect: "sqlite",
        storage: "./database.sqlite",
        logging: false,
        dialectOptions: {
          timeout: 10000,
        },
        retry: {
          max: 5,
        },
      })
    : new Sequelize(
        process.env.DB_NAME || "neetcode_tracker",
        process.env.DB_USER || "root",
        process.env.DB_PASS || "",
        {
          host: process.env.DB_HOST || "localhost",
          port: process.env.DB_PORT || 3306,
          dialect: "mysql",
          logging: false,
        }
      );

