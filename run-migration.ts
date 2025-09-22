import { Sequelize } from 'sequelize';
import { sequelize } from './src/config/database';
import dotenv from 'dotenv';

dotenv.config();
 
async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'health-hub';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '123456789';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');

  // Connect to postgres database to create our target database
  const adminSequelize = new Sequelize('postgres', dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await adminSequelize.authenticate();
    await adminSequelize.query(`CREATE DATABASE "${dbName}";`);
    console.log(`Database "${dbName}" created successfully.`);
  } catch (error: any) {
    if (error.original?.code === '42P04') {
      console.log(`Database "${dbName}" already exists.`);
    } else {
      throw error;
    }
  } finally {
    await adminSequelize.close();
  }
}

async function runMigration() {
  try {
    console.log('Checking/creating database...');
    await createDatabaseIfNotExists();

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    console.log('Running migration...');
    const migration = await import('./src/db/migrations.js');
    const migrationModule = migration.default;
    await migrationModule.up(sequelize.getQueryInterface(), sequelize.constructor);
    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigration();