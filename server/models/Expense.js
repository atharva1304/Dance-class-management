import mongoose from 'mongoose'

const ExpenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['rent', 'utilities', 'equipment', 'maintenance', 'salary', 'other'],
    },
    description: String,
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank', 'upi', 'cheque'],
    },
    referenceNumber: String,
    notes: String,
    attachments: [String],
  },
  { timestamps: true }
)

export default mongoose.model('Expense', ExpenseSchema)
