import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    phone: String,
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'superadmin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password
AdminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('Admin', AdminSchema)
