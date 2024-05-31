const express = require('express')
const router = express.Router()
const currencies = require('../controllers/currencies')
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(catchAsync(currencies.getAll))
    .post(catchAsync(currencies.create))

router.route('/:name')
    .get(catchAsync(currencies.getOne))
    .put(catchAsync(currencies.editOne))
    .delete(catchAsync(currencies.deleteOne))

module.exports = router