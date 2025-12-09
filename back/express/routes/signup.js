import express from 'express'
import { signUp } from '../controllers/auth.js'
import catchAsync from '../utils/catchAsync.js'

const router = express.Router()

router.route('/')
    .post(catchAsync(signUp))

export default router