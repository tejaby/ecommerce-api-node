import { Sequelize } from "@sequelize/core";
import { MsSqlDialect } from "@sequelize/mssql";

import {
  DB_SERVER,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
} from "./config.js";

import dotenv from "dotenv";

dotenv.config();


const sequelize = new Sequelize({
  dialect: MsSqlDialect,
  server: DB_SERVER,
  port: parseInt(DB_PORT),
  database: DB_DATABASE,
  authentication: {
    type: "default",
    options: {
      userName: DB_USERNAME,
      password: DB_PASSWORD,
    },
  },
  trustServerCertificate: true,
});

export default sequelize;
