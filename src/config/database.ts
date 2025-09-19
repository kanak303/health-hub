import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "healthhub",
  process.env.DB_USER || "healthhub",
  process.env.DB_PASS || "123456789",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);
export default sequelize; 




