import express from 'express'
import { getAll, create, deleteMany, getOne, editOne, deleteOne } from '../controllers/categories.js'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
    .get(catchAsync(getAll))
    .post(catchAsync(create))
    .delete(catchAsync(deleteMany))

router.route('/:id')
    .get(catchAsync(getOne))
    .put(catchAsync(editOne))
    .delete(catchAsync(deleteOne))

export default router