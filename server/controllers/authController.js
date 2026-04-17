import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import Student from '../models/Student.js'

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role' })
    }

    const Model = role === 'admin' ? Admin : Student

    const user = await Model.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = role === 'admin' ? await user.comparePassword(password) : password === user.password

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' })
}

export const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

    res.json({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role' })
    }

    const Model = role === 'admin' ? Admin : Student

    const existingUser = await Model.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const user = await Model.create({
      email,
      password,
      name,
    })

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
