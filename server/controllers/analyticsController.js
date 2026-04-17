import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import Expense from '../models/Expense.js'

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'active' })
    const totalExpenses = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])

    res.json({
      totalStudents,
      totalExpenses: totalExpenses[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      netProfit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRevenueData = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'completed' }).sort({ date: 1 })
    res.json(payments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getExpenseData = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: 1 })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' },
        },
      },
    ])
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
