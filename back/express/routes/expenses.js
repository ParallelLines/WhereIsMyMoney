const express = require('express')
const router = express.Router()
const expenses = require('../controllers/expenses')

router.route('/')
    .get(expenses.getAll)
    .post(expenses.create)

router.route('/:id')
    .get(expenses.getOne)
    .put(expenses.editOne)
    .delete(expenses.deleteOne)

module.exports = router