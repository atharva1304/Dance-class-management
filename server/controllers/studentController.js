import Student from '../models/Student.js'
import Payment from '../models/Payment.js'
import { Op } from 'sequelize'

export const getStudents = async (req, res) => {
  try {
    const { status, level, searchTerm } = req.query
    let where = {}

    if (status) where.status = status
    if (level) where.level = level
    if (searchTerm) {
      where[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
      ]
    }

    const students = await Student.findAll({
      where,
      order: [['createdAt', 'DESC']],
    })
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json(student)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    
    await student.update(req.body)
    res.json(student)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    
    await student.destroy()
    res.json({ message: 'Student deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { studentId: req.params.id },
      order: [['date', 'DESC']],
    })
    res.json(payments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId, notes } = req.body

    const payment = await Payment.create({
      studentId: req.params.id,
      amount,
      paymentMethod,
      transactionId,
      notes,
      date: new Date(),
    })

    // Update student's total paid
    const student = await Student.findByPk(req.params.id)
    await student.increment('totalPaid', { by: amount })
    await student.update({ lastPaymentDate: new Date() })

    res.status(201).json(payment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
