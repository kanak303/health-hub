import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class User extends Model {}
User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "doctor", "patient"), allowNull: false },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, modelName: "User" }
);

export default User; 


