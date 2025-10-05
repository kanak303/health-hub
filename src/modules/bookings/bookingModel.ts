import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

export interface BookingAttributes {
  id?: string;
  userId: string;
  doctorId: string;
  slotId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: Date;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Booking extends Model<BookingAttributes> implements BookingAttributes {
  public id!: string;
  public userId!: string;
  public doctorId!: string;
  public slotId!: string;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  public bookingDate!: Date;
  public notes?: string;
  public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
  public transactionId?: string;
  public amount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    slotId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending',
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
  }
);

export default Booking;