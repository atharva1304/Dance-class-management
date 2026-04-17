import api from './api'

export const getExpenses = async (filters = {}) => {
  return api.get('/expenses', { params: filters })
}

export const createExpense = async (data) => {
  return api.post('/expenses', data)
}

export const updateExpense = async (id, data) => {
  return api.put(`/expenses/${id}`, data)
}

export const deleteExpense = async (id) => {
  return api.delete(`/expenses/${id}`)
}

export const getExpenseCategories = async () => {
  return api.get('/expenses/categories')
}
