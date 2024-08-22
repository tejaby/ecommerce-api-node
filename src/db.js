import { Sequelize } from "@sequelize/core";
import { MsSqlDialect } from "@sequelize/mssql";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  authentication: {
    type: "default",
    options: {
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  },
  trustServerCertificate: true,
});

export default sequelize;
