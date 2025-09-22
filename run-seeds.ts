import { sequelize } from './src/config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

async function runSeeds() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    console.log('Running seeds...');
    const seeders = await import('./src/db/seeders.js');
    const seedersModule = seeders.default;
    await seedersModule.up(sequelize.getQueryInterface());
    console.log('Seeds completed successfully!');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runSeeds();