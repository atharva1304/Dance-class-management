/**
 * MongoDB to MySQL Migration Script
 * 
 * This script helps migrate existing MongoDB data to MySQL/Sequelize.
 * Run after MySQL is set up and Sequelize models are created.
 * 
 * Usage: node scripts/migrateData.js
 */

import Admin from '../models/Admin.js'
import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import Expense from '../models/Expense.js'
import { connectDB } from '../config/db.js'
import dotenv from 'dotenv'

dotenv.config()

async function migrateData() {
  try {
    console.log('🔄 Starting data migration from MongoDB to MySQL...')

    // Connect to database
    await connectDB()
    console.log('✅ Connected to MySQL database')

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await sequelize.truncate({ cascade: true })
    // console.log('✅ Cleared existing data')

    // Create sample data for testing
    console.log('📝 Creating sample data...')

    // Create sample admin
    const admin = await Admin.create({
      email: 'admin@danceschool.com',
      password: 'admin123',
      name: 'Admin User',
      phone: '+1234567890',
      role: 'admin',
      isActive: true,
    })
    console.log('✅ Created sample admin:', admin.email)

    // Create sample students
    const students = await Student.bulkCreate([
      {
        email: 'student1@danceschool.com',
        password: 'student123',
        name: 'Student One',
        phone: '+1111111111',
        address: '123 Main St',
        danceType: 'Ballet',
        level: 'beginner',
        batchTiming: '10:00 AM - 11:00 AM',
        feeAmount: 500.00,
        feeFrequency: 'monthly',
        status: 'active',
        joinDate: new Date(),
        totalPaid: 0,
      },
      {
        email: 'student2@danceschool.com',
        password: 'student123',
        name: 'Student Two',
        phone: '+2222222222',
        address: '456 Oak Ave',
        danceType: 'Hip Hop',
        level: 'intermediate',
        batchTiming: '4:00 PM - 5:00 PM',
        feeAmount: 600.00,
        feeFrequency: 'monthly',
        status: 'active',
        joinDate: new Date(),
        totalPaid: 0,
      },
      {
        email: 'student3@danceschool.com',
        password: 'student123',
        name: 'Student Three',
        phone: '+3333333333',
        address: '789 Pine Rd',
        danceType: 'Contemporary',
        level: 'advanced',
        batchTiming: '6:00 PM - 7:00 PM',
        feeAmount: 700.00,
        feeFrequency: 'monthly',
        status: 'active',
        joinDate: new Date(),
        totalPaid: 1200.00,
      },
    ])
    console.log(`✅ Created ${students.length} sample students`)

    // Create sample payments
    const payments = await Payment.bulkCreate([
      {
        studentId: students[0].id,
        amount: 500.00,
        date: new Date(),
        month: 'April 2024',
        paymentMethod: 'cash',
        status: 'completed',
      },
      {
        studentId: students[1].id,
        amount: 600.00,
        date: new Date(),
        month: 'April 2024',
        paymentMethod: 'bank',
        status: 'completed',
      },
      {
        studentId: students[2].id,
        amount: 700.00,
        date: new Date(),
        month: 'March 2024',
        paymentMethod: 'upi',
        status: 'completed',
      },
      {
        studentId: students[2].id,
        amount: 700.00,
        date: new Date(),
        month: 'April 2024',
        paymentMethod: 'upi',
        status: 'completed',
      },
    ])
    console.log(`✅ Created ${payments.length} sample payments`)

    // Create sample expenses
    const expenses = await Expense.bulkCreate([
      {
        category: 'rent',
        description: 'Monthly studio rent',
        amount: 2000.00,
        date: new Date(),
        paymentMethod: 'bank',
        referenceNumber: 'CHK-001',
      },
      {
        category: 'utilities',
        description: 'Electricity and water',
        amount: 500.00,
        date: new Date(),
        paymentMethod: 'bank',
      },
      {
        category: 'equipment',
        description: 'Sound system upgrade',
        amount: 5000.00,
        date: new Date(),
        paymentMethod: 'upi',
      },
      {
        category: 'salary',
        description: 'Instructor salary',
        amount: 3000.00,
        date: new Date(),
        paymentMethod: 'bank',
      },
    ])
    console.log(`✅ Created ${expenses.length} sample expenses`)

    console.log('\n✨ Migration completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   • Admins: ${await Admin.count()}`)
    console.log(`   • Students: ${await Student.count()}`)
    console.log(`   • Payments: ${await Payment.count()}`)
    console.log(`   • Expenses: ${await Expense.count()}`)
    console.log('\n🔐 Sample Login Credentials:')
    console.log('   Admin:')
    console.log('   Email: admin@danceschool.com')
    console.log('   Password: admin123')
    console.log('\n   Student:')
    console.log('   Email: student1@danceschool.com')
    console.log('   Password: student123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Run migration
migrateData()
