import express from 'express'
import * as analyticsController from '../controllers/analyticsController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/dashboard', authMiddleware, analyticsController.getDashboardStats)
router.get('/revenue', authMiddleware, analyticsController.getRevenueData)
router.get('/expenses', authMiddleware, analyticsController.getExpenseData)
router.get('/students', authMiddleware, analyticsController.getStudentStats)
router.get('/payments', authMiddleware, analyticsController.getPaymentStats)

export default router
