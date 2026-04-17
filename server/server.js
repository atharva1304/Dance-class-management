import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Import routes
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

// Import middlewares
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import connectDB from './config/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB().catch((error) => {
  console.error('Database connection failed:', error)
  process.exit(1)
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/uploads', uploadRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Error handling middleware
app.use(errorMiddleware)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
