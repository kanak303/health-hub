import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/database";
import User from "./src/modules/user/userModels";
import authRoutes from "./src/route/authRoutes.js";
import { connectRedis } from "./src/config/redis.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT =  3000;

// routes
app.use('/api/auth', authRoutes);

app.get("/", async (req, res) => {
  const users = await User.findAll();
  console.log(users);
  res.json(users);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected Successfully !");
    
    await connectRedis();
    
    // Test Redis connection
    try {
      const { setOTP, getOTP } = await import('./src/config/redis.js');
      await setOTP('test:connection', 'working', 60);
      const testValue = await getOTP('test:connection');
      console.log(`Redis test: ${testValue === 'working' ? 'PASSED' : 'FAILED'}`);
    } catch (redisError) {
      console.log('Redis test FAILED:', redisError.message);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect:", error);
  }
})();
