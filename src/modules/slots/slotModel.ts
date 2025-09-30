import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

export interface SlotAttributes {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'cancelled';
  patientId?: string;
}

export class Slot extends Model<SlotAttributes> implements SlotAttributes {
  public id!: string;
  public doctorId!: string;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public status!: 'available' | 'booked' | 'cancelled';
  public patientId?: string;
}

Slot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'booked', 'cancelled'),
      allowNull: false,
      defaultValue: 'available',
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Slot',
    tableName: 'Slots',
  }
);

export default Slot;
