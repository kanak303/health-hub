import sequelize from './src/config/database';

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('Sync failed:', error.message);
    process.exit(1);
  }
}

syncDatabase();