import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Only set test environment when actually running tests
if (process.argv.some(arg => arg.includes('mocha') || arg.includes('test'))) {
  process.env.NODE_ENV = 'test';
}

// Create test database connection - NEVER touches main database
export const testSequelize = new Sequelize(
  process.env.TEST_DB_NAME || "health-hub-test",
  process.env.DB_USER || "healthhub", 
  process.env.DB_PASSWORD || "123456789",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: false,
  }
);

// Prevent accidental main database usage
if (testSequelize.getDatabaseName() === (process.env.DB_NAME || "health-hub")) {
  throw new Error("CRITICAL: Tests are trying to use main database! Check TEST_DB_NAME configuration.");
}

export default testSequelize;