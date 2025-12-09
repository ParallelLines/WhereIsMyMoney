import express from 'express'
import { logIn } from '../controllers/auth.js'
import catchAsync from '../utils/catchAsync.js'

const router = express.Router()

router.route('/')
    .post(catchAsync(logIn))

export default router