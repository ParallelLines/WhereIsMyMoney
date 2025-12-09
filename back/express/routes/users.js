import express from 'express'
import { create, getOne, editOne, deleteOne } from '../controllers/users.js'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
    .post(catchAsync(create))

router.route('/:id')
    .get(catchAsync(getOne))
    .put(catchAsync(editOne))
    .delete(catchAsync(deleteOne))

export default router