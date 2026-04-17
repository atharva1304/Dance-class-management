import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Expense = sequelize.define(
  'Expense',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM('rent', 'utilities', 'equipment', 'maintenance', 'salary', 'other'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank', 'upi', 'cheque'),
    },
    referenceNumber: {
      type: DataTypes.STRING(255),
    },
    notes: {
      type: DataTypes.TEXT,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['date'],
      },
    ],
  }
)

export default Expense
