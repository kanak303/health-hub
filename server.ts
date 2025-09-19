import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/database";
import User from "./src/modules/user/userModels";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// route
app.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected Successfully !");
    await sequelize.sync({ force: true });
    console.log("Tables synchronized!");

    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect:", error);
  }
})();
