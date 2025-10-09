import express from 'express';
import sequelize from '../src/config/database';
import authRoutes from '../src/route/authRoutes';
import { connectRedis } from '../src/config/redis';

export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  return app;
};

export const setupTestDB = async () => {
  await sequelize.sync({ force: false, alter: true });
  await connectRedis();
};

export const teardownTestDB = async () => {
  await sequelize.close();
};