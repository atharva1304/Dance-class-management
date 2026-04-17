import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import Expense from '../models/Expense.js'
import { sequelize } from '../config/db.js'
import { Op, fn, col } from 'sequelize'

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.count({ where: { status: 'active' } })
    
    const totalExpensesResult = await Expense.findAll({
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true,
    })
    const totalExpenses = totalExpensesResult[0]?.total || 0

    const totalRevenueResult = await Payment.findAll({
      where: { status: 'completed' },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true,
    })
    const totalRevenue = totalRevenueResult[0]?.total || 0

    res.json({
      totalStudents,
      totalExpenses: parseFloat(totalExpenses) || 0,
      totalRevenue: parseFloat(totalRevenue) || 0,
      netProfit: (parseFloat(totalRevenue) || 0) - (parseFloat(totalExpenses) || 0),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRevenueData = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { status: 'completed' },
      order: [['date', 'ASC']],
    })
    res.json(payments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getExpenseData = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['date', 'ASC']],
    })
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentStats = async (req, res) => {
  try {
    const stats = await Student.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    })
    
    const formattedStats = stats.map(s => ({
      _id: s.status,
      count: parseInt(s.count),
    }))
    
    res.json(formattedStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('amount')), 'total'],
      ],
      group: ['status'],
      raw: true,
    })
    
    const formattedStats = stats.map(s => ({
      _id: s.status,
      count: parseInt(s.count),
      total: parseFloat(s.total),
    }))
    
    res.json(formattedStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
