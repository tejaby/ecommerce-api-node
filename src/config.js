import { config } from "dotenv";

config();

export const PORT = process.env.PORT;

export const DB_SERVER = process.env.DB_SERVER;
export const DB_PORT = process.env.DB_PORT;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const JWT_SECRET = process.env.JWT_SECRET;
