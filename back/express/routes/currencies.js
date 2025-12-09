import express from 'express'
import { getAll, create, getOne, editOne, deleteOne } from '../controllers/currencies.js'
import catchAsync from '../utils/catchAsync.js'
import verifyJWT from '../middleware.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/')
    .get(catchAsync(getAll))
    .post(catchAsync(create))

router.route('/:name')
    .get(catchAsync(getOne))
    .put(catchAsync(editOne))
    .delete(catchAsync(deleteOne))

export default router