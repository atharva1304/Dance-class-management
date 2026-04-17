import api from './api'

export const login = async (email, password, role) => {
  return api.post('/auth/login', { email, password, role })
}

export const logout = async () => {
  return api.post('/auth/logout')
}

export const verifyToken = async () => {
  return api.get('/auth/verify')
}

export const register = async (email, password, role) => {
  return api.post('/auth/register', { email, password, role })
}
