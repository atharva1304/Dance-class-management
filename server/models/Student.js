import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Student = sequelize.define(
  'Student',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    danceType: {
      type: DataTypes.STRING(255),
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner',
    },
    batchTiming: {
      type: DataTypes.STRING(255),
    },
    feeAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    feeFrequency: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
      defaultValue: 'monthly',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated', 'suspended'),
      defaultValue: 'active',
    },
    joinDate: {
      type: DataTypes.DATE,
    },
    lastPaymentDate: {
      type: DataTypes.DATE,
    },
    totalPaid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
)

export default Student
