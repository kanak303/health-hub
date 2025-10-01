import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Clinic extends Model {
  public id!: string;
  public hospitalName!: string;
  public doctorName!: string;
  public slug!: string;
  public address!: string | null;
  public phone!: string | null;
  public deletedAt!: Date | null;
}

Clinic.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    hospitalName: { type: DataTypes.STRING, allowNull: false },
    doctorName: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
  },
  { sequelize, modelName: "Clinic", paranoid: true }
);

export default Clinic;