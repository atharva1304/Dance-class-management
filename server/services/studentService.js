import Student from '../models/Student.js'
import Payment from '../models/Payment.js'

export const createStudent = async (data) => {
  return Student.create(data)
}

export const updateStudent = async (id, data) => {
  const student = await Student.findByPk(id)
  if (!student) throw new Error('Student not found')
  return student.update(data)
}

export const deleteStudent = async (id) => {
  const student = await Student.findByPk(id)
  if (!student) throw new Error('Student not found')
  return student.destroy()
}

export const getStudentWithPayments = async (id) => {
  const student = await Student.findByPk(id, {
    include: {
      association: 'payments',
      attributes: ['id', 'amount', 'date', 'status', 'paymentMethod'],
    },
  })
  return student
}

export const calculateStudentDuePayment = async (id) => {
  const student = await Student.findByPk(id)
  if (!student) throw new Error('Student not found')

  const monthlyFee = student.feeAmount
  const totalPaid = student.totalPaid

  return {
    monthlyFee,
    totalPaid,
    dueAmount: Math.max(0, monthlyFee - totalPaid),
  }
}
