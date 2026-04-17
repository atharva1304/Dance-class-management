import mongoose from 'mongoose'

const StudentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: String,
    name: {
      type: String,
      required: true,
    },
    phone: String,
    address: String,
    danceType: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    batchTiming: String,
    feeAmount: {
      type: Number,
      default: 0,
    },
    feeFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended'],
      default: 'active',
    },
    joinDate: Date,
    lastPaymentDate: Date,
    totalPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Student', StudentSchema)
