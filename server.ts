import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/database";
import { User } from "./src/modules/user/userModels";
import authRoutes from "./src/route/authRoutes";
import doctorRoutes from './src/route/doctorRoutes';
import slotRoutes from "./src/route/slotRoutes";
import clinicRoutes from "./src/route/clinicRoutes";
import bookingRoutes from "./src/route/bookingRoutes";
import slotHoldRoutes from "./src/route/slotHoldRoutes";
import clinicAdminRoutes from "./src/route/clinicAdminRoutes";
import { connectRedis } from "./src/config/redis";
import { swaggerUi, specs } from "./src/docs/swagger";

dotenv.config();

const app = express();
app.use(express.json());

const PORT =  3000;

// routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/slots", slotHoldRoutes);
app.use('/api/clinic-admin', clinicAdminRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
    } catch (redisError:any) {
      console.log('Redis test FAILED:', redisError.message);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect:", error);
  }
})();
