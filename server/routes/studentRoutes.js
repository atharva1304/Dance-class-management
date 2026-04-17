import express from 'express'
import * as studentController from '../controllers/studentController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, studentController.getStudents)
router.get('/:id', authMiddleware, studentController.getStudent)
router.post('/', authMiddleware, studentController.createStudent)
router.put('/:id', authMiddleware, studentController.updateStudent)
router.delete('/:id', authMiddleware, studentController.deleteStudent)
router.get('/:id/payments', authMiddleware, studentController.getStudentPayments)
router.post('/:id/payments', authMiddleware, studentController.addPayment)

export default router
