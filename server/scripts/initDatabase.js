/**
 * Database Initialization Script
 * 
 * This script initializes the MySQL database and creates all tables.
 * Run this before starting the server for the first time.
 * 
 * Usage: node scripts/initDatabase.js
 */

import { connectDB } from '../config/db.js'
import dotenv from 'dotenv'

dotenv.config()

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing MySQL database...')

    // Connect and sync
    const sequelize = await connectDB()

    console.log('✅ Database initialized successfully!')
    console.log('\n📋 Created tables:')
    console.log('   • admins')
    console.log('   • students')
    console.log('   • payments')
    console.log('   • expenses')

    console.log('\n🔗 Relationships configured:')
    console.log('   • Student ↔ Payment (One-to-Many)')

    console.log('\n📈 Indexes created on:')
    console.log('   • Student: email (unique), status, createdAt')
    console.log('   • Payment: studentId, status, date')
    console.log('   • Expense: category, date')

    console.log('\n✨ Ready to start the server!')
    console.log('   Run: npm run dev')

    process.exit(0)
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Initialize database
initializeDatabase()
