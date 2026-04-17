import Student from '../models/Student.js'
import Payment from '../models/Payment.js'

export const createStudent = async (data) => {
  const student = new Student(data)
  return student.save()
}

export const updateStudent = async (id, data) => {
  return Student.findByIdAndUpdate(id, data, { new: true })
}

export const deleteStudent = async (id) => {
  return Student.findByIdAndDelete(id)
}

export const getStudentWithPayments = async (id) => {
  const student = await Student.findById(id)
  const payments = await Payment.find({ studentId: id })
  return {
    ...student.toObject(),
    payments,
  }
}

export const calculateStudentDuePayment = async (id) => {
  const student = await Student.findById(id)
  if (!student) throw new Error('Student not found')

  const monthlyFee = student.feeAmount
  const payments = await Payment.find({ studentId: id, status: 'completed' })
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  return {
    monthlyFee,
    totalPaid,
    dueAmount: Math.max(0, monthlyFee - totalPaid),
  }
}
