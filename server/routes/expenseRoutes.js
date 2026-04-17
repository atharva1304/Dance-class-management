import express from 'express'
import * as expenseController from '../controllers/expenseController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, expenseController.getExpenses)
router.post('/', authMiddleware, expenseController.createExpense)
router.put('/:id', authMiddleware, expenseController.updateExpense)
router.delete('/:id', authMiddleware, expenseController.deleteExpense)
router.get('/categories', expenseController.getExpenseCategories)

export default router
