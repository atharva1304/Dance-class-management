import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import Student from './Student.js'

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student,
        key: 'id',
      },
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
    month: {
      type: DataTypes.STRING(50),
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank', 'upi', 'check', 'online'),
      defaultValue: 'cash',
    },
    transactionId: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.ENUM('completed', 'pending', 'cancelled', 'refunded'),
      defaultValue: 'completed',
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ['studentId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['date'],
      },
    ],
  }
)

// Setup associations
Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' })
Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' })

export default Payment
