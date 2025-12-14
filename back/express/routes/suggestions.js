import express from 'express'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'
import { getCategoriesByExpenseName, getExpenseNames } from '../controllers/suggestions.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/category/:name')
    .get(catchAsync(getCategoriesByExpenseName))

router.route('/expense/:name')
    .get(catchAsync(getExpenseNames))

export default router

