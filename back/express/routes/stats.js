import express from 'express'
import { getPieStats } from '../controllers/stats.js'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
    .get(catchAsync(getPieStats))

export default router