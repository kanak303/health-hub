import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

export interface SlotHoldAttributes {
  id?: string;
  slotId: string;
  userId: string;
  expiresAt: Date;
  createdAt?: Date;
}

class SlotHold extends Model<SlotHoldAttributes> implements SlotHoldAttributes {
  public id!: string;
  public slotId!: string;
  public userId!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

SlotHold.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slotId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SlotHold",
    tableName: "slot_holds",
    timestamps: true,
    updatedAt: false,
  }
);

export default SlotHold;