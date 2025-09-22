import { sequelize } from './src/config/database.js';

async function addRefreshTokenColumn() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Add refreshToken column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;
    `);
    
    console.log('RefreshToken column added successfully!');
  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    await sequelize.close();
  }
}

addRefreshTokenColumn();