import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import Expense from '../models/Expense.js'
import { fn, col, Op } from 'sequelize'

export const generateAnalytics = async (startDate, endDate) => {
  const where = {}
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt[Op.gte] = new Date(startDate)
    if (endDate) where.createdAt[Op.lte] = new Date(endDate)
  }

  const totalStudents = await Student.count()
  const activeStudents = await Student.count({ where: { status: 'active' } })

  const totalRevenueResult = await Payment.findAll({
    where: { status: 'completed', ...where },
    attributes: [[fn('SUM', col('amount')), 'total']],
    raw: true,
  })
  const totalRevenue = parseFloat(totalRevenueResult[0]?.total) || 0

  const totalExpensesResult = await Expense.findAll({
    where,
    attributes: [[fn('SUM', col('amount')), 'total']],
    raw: true,
  })
  const totalExpenses = parseFloat(totalExpensesResult[0]?.total) || 0

  return {
    totalStudents,
    activeStudents,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
  }
}

export const getMonthlySummary = async (year, month) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const revenueResult = await Payment.findAll({
    where: {
      status: 'completed',
      date: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    attributes: [[fn('SUM', col('amount')), 'total']],
    raw: true,
  })

  const expensesResult = await Expense.findAll({
    where: {
      date: {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      },
    },
    attributes: [[fn('SUM', col('amount')), 'total']],
    raw: true,
  })

  const revenue = parseFloat(revenueResult[0]?.total) || 0
  const expenses = parseFloat(expensesResult[0]?.total) || 0

  return {
    revenue,
    expenses,
    profit: revenue - expenses,
  }
}
