import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/database";
import User from "./src/modules/user/userModels";
import authRoutes from "./src/route/authRoutes.js";

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
    
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect:", error);
  }
})();
