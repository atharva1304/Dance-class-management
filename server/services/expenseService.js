import Expense from '../models/Expense.js'

export const createExpense = async (data) => {
  const expense = new Expense(data)
  return expense.save()
}

export const getTotalExpenses = async (startDate, endDate) => {
  const query = {}
  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = new Date(startDate)
    if (endDate) query.date.$lte = new Date(endDate)
  }

  const result = await Expense.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ])

  return result[0] || { total: 0, count: 0 }
}

export const getExpensesByCategory = async (startDate, endDate) => {
  const query = {}
  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = new Date(startDate)
    if (endDate) query.date.$lte = new Date(endDate)
  }

  return Expense.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ])
}
