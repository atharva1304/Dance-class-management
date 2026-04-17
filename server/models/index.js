import Admin from './Admin.js'
import Student from './Student.js'
import Payment from './Payment.js'
import Expense from './Expense.js'

// Setup associations
const setupAssociations = () => {
  // Payment belongs to Student
  Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' })
  // Student has many Payments
  Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' })
}

setupAssociations()

export { Admin, Student, Payment, Expense }
