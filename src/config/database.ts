import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "healthhub",
  process.env.DB_USER || "healthhub",
  process.env.DB_PASSWORD || "123456789",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: (process.env.DB_DIALECT as any) || "postgres",
    logging: false,
  }
);
export default sequelize; 




