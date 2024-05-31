const express = require('express')
const router = express.Router()
const expenses = require('../controllers/expenses')
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(catchAsync(expenses.getAll))
    .post(catchAsync(expenses.create))

router.route('/:id')
    .get(catchAsync(expenses.getOne))
    .put(catchAsync(expenses.editOne))
    .delete(catchAsync(expenses.deleteOne))

module.exports = router