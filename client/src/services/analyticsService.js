import api from './api'

export const getDashboardStats = async () => {
  return api.get('/analytics/dashboard')
}

export const getRevenueData = async (period = 'monthly') => {
  return api.get('/analytics/revenue', { params: { period } })
}

export const getExpenseData = async (period = 'monthly') => {
  return api.get('/analytics/expenses', { params: { period } })
}

export const getStudentStats = async () => {
  return api.get('/analytics/students')
}

export const getPaymentStats = async () => {
  return api.get('/analytics/payments')
}
