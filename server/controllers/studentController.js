import Student from '../models/Student.js'
import Payment from '../models/Payment.js'

export const getStudents = async (req, res) => {
  try {
    const { status, level, searchTerm } = req.query
    let query = {}

    if (status) query.status = status
    if (level) query.level = level
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ]
    }

    const students = await Student.find(query).sort({ createdAt: -1 })
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body)
    await student.save()
    res.status(201).json(student)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json({ message: 'Student deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.id }).sort({ date: -1 })
    res.json(payments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId, notes } = req.body

    const payment = new Payment({
      studentId: req.params.id,
      amount,
      paymentMethod,
      transactionId,
      notes,
      date: new Date(),
    })

    await payment.save()

    // Update student's total paid
    const student = await Student.findById(req.params.id)
    student.totalPaid += amount
    student.lastPaymentDate = new Date()
    await student.save()

    res.status(201).json(payment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
