import api from './api'

export const getStudents = async (filters = {}) => {
  return api.get('/students', { params: filters })
}

export const getStudent = async (id) => {
  return api.get(`/students/${id}`)
}

export const createStudent = async (data) => {
  return api.post('/students', data)
}

export const updateStudent = async (id, data) => {
  return api.put(`/students/${id}`, data)
}

export const deleteStudent = async (id) => {
  return api.delete(`/students/${id}`)
}

export const getStudentPayments = async (studentId) => {
  return api.get(`/students/${studentId}/payments`)
}

export const addPayment = async (studentId, data) => {
  return api.post(`/students/${studentId}/payments`, data)
}
