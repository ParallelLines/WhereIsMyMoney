import express from 'express'
import { getPieStats, getRegularsSumForNextMonth } from '../controllers/stats.js'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/pie')
    .get(catchAsync(getPieStats))

router.route('/nextMonthRegulars')
    .get(catchAsync(getRegularsSumForNextMonth))

export default router