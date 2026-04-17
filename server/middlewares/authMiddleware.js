import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export const studentMiddleware = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ message: 'Student access required' })
  }
  next()
}
