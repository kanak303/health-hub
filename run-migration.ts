import { sequelize } from './src/config/database';
import dotenv from 'dotenv';

dotenv.config();
 
async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'health-hub';
  console.log(`Database "${dbName}" connection will be handled by main sequelize instance.`);
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