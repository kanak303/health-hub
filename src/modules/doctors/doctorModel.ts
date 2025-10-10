import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export class Doctor extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public specialty!: string;
  public experience!: number;
  public qualification!: string;
  public licenseNumber!: string;
  public phone!: string;
  public consultationFee!: number;
  public availability!: object;
  public bio?: string;
  public profileImage?: string;
  public isActive!: boolean;
  public rating?: number;
  public totalReviews?: number;
  public clinic_id?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Doctor.init(
  {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    userId: { 
      type: DataTypes.UUID, 
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    specialty: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    experience: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    qualification: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    licenseNumber: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    phone: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    consultationFee: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false 
    },
    availability: { 
      type: DataTypes.JSON, 
      allowNull: false,
      defaultValue: {}
    },
    bio: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    profileImage: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
    rating: { 
      type: DataTypes.DECIMAL(2, 1), 
      allowNull: true,
      defaultValue: 0.0
    },
    totalReviews: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      defaultValue: 0
    },
    clinic_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Clinics',
        key: 'id'
      }
    }
  },
  { 
    sequelize, 
    modelName: "Doctor", 
    timestamps: true 
  }
);

export default Doctor;