import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class User extends Model {

  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "doctor" | "patient";
  public isVerified!: boolean;
  public resetToken?: string;
  public resetTokenExpiry?: Date;

}
User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "doctor", "patient"), allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    // Added fields for Forgot Password functionality
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, modelName: "User", timestamps: false }
);

export default User;