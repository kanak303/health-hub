import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Clinic extends Model {}
Clinic.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Clinic" }
);