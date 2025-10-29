const express = require('express')
const router = express.Router()
const expenses = require('../controllers/expenses')
const catchAsync = require('../utils/catchAsync')
const { verifyJWT } = require('../middleware')

router.use(verifyJWT)

router.route('/')
    .get(catchAsync(expenses.getAll))
    .post(catchAsync(expenses.create))
    .delete(catchAsync(expenses.deleteMany))

router.route('/names/:prefix')
    .get(catchAsync(expenses.getNamesByPrefix))

router.route('/:id')
    .get(catchAsync(expenses.getOne))
    .put(catchAsync(expenses.editOne))
    .delete(catchAsync(expenses.deleteOne))

module.exports = router