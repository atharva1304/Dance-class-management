import express from 'express'
import * as uploadController from '../controllers/uploadController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, uploadController.uploadExcel)
router.get('/status/:id', authMiddleware, uploadController.getUploadStatus)

export default router
