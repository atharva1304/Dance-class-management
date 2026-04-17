import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import Expense from '../models/Expense.js'

export const generateAnalytics = async (startDate, endDate) => {
  const query = {}
  if (startDate || endDate) {
    query.createdAt = {}
    if (startDate) query.createdAt.$gte = new Date(startDate)
    if (endDate) query.createdAt.$lte = new Date(endDate)
  }

  const totalStudents = await Student.countDocuments()
  const activeStudents = await Student.countDocuments({ status: 'active' })
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed', ...query } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])
  const totalExpenses = await Expense.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])

  return {
    totalStudents,
    activeStudents,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalExpenses: totalExpenses[0]?.total || 0,
    netProfit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0),
  }
}

export const getMonthlySummary = async (year, month) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const revenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        date: { $gte: startDate, $lt: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])

  const expenses = await Expense.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lt: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])

  return {
    revenue: revenue[0]?.total || 0,
    expenses: expenses[0]?.total || 0,
    profit: (revenue[0]?.total || 0) - (expenses[0]?.total || 0),
  }
}
