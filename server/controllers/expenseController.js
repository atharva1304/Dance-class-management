import Expense from '../models/Expense.js'

export const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query
    let query = {}

    if (category) query.category = category
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const expenses = await Expense.find(query).sort({ date: -1 })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body)
    await expense.save()
    res.status(201).json(expense)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!expense) return res.status(404).json({ message: 'Expense not found' })
    res.json(expense)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id)
    if (!expense) return res.status(404).json({ message: 'Expense not found' })
    res.json({ message: 'Expense deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getExpenseCategories = (req, res) => {
  const categories = ['rent', 'utilities', 'equipment', 'maintenance', 'salary', 'other']
  res.json(categories)
}
