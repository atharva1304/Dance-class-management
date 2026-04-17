import express from 'express'
import * as authController from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', authController.login)
router.post('/logout', authMiddleware, authController.logout)
router.get('/verify', authController.verifyToken)
router.post('/register', authController.register)

export default router
