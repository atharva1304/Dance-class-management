import Expense from '../models/Expense.js'
import { fn, col, Op } from 'sequelize'

export const createExpense = async (data) => {
  return Expense.create(data)
}

export const getTotalExpenses = async (startDate, endDate) => {
  const where = {}
  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date[Op.gte] = new Date(startDate)
    if (endDate) where.date[Op.lte] = new Date(endDate)
  }

  const result = await Expense.findAll({
    where,
    attributes: [
      [fn('SUM', col('amount')), 'total'],
      [fn('COUNT', col('id')), 'count'],
    ],
    raw: true,
  })

  return {
    total: parseFloat(result[0]?.total) || 0,
    count: parseInt(result[0]?.count) || 0,
  }
}

export const getExpensesByCategory = async (startDate, endDate) => {
  const where = {}
  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date[Op.gte] = new Date(startDate)
    if (endDate) where.date[Op.lte] = new Date(endDate)
  }

  return Expense.findAll({
    where,
    attributes: [
      'category',
      [fn('SUM', col('amount')), 'total'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['category'],
    raw: true,
  })
}
