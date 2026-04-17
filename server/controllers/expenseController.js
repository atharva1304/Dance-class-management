import Expense from '../models/Expense.js'
import { Op } from 'sequelize'

export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query
    let where = {}

    if (category) where.category = category
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date[Op.gte] = new Date(startDate)
      if (endDate) where.date[Op.lte] = new Date(endDate)
    }

    const expenses = await Expense.findAll({
      where,
      order: [['date', 'DESC']],
    })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body)
    res.status(201).json(expense)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id)
    if (!expense) return res.status(404).json({ message: 'Expense not found' })
    
    await expense.update(req.body)
    res.json(expense)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id)
    if (!expense) return res.status(404).json({ message: 'Expense not found' })
    
    await expense.destroy()
    res.json({ message: 'Expense deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getExpenseCategories = (req, res) => {
  const categories = ['rent', 'utilities', 'equipment', 'maintenance', 'salary', 'other']
  res.json(categories)
}
