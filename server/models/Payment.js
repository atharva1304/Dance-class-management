import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    month: String, // e.g., "January 2024"
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank', 'upi', 'check', 'online'],
      default: 'cash',
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled', 'refunded'],
      default: 'completed',
    },
    notes: String,
  },
  { timestamps: true }
)

export default mongoose.model('Payment', PaymentSchema)
