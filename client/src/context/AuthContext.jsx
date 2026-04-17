import React, { createContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await authService.verifyToken()
          setUser(userData)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password, role) => {
    try {
      setError(null)
      const data = await authService.login(email, password, role)
      setUser(data.user)
      localStorage.setItem('token', data.token)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
