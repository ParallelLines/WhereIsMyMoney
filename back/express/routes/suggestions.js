import express from 'express'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'
import { getCategoriesByExpenseName } from '../controllers/suggestions.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/category/:name')
    .get(catchAsync(getCategoriesByExpenseName))

export default router

