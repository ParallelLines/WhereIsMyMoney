const express = require('express')
const router = express.Router()
const categories = require('../controllers/categories')
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(catchAsync(categories.getAll))
    .post(catchAsync(categories.create))

router.route('/:id')
    .get(catchAsync(categories.getOne))
    .put(catchAsync(categories.editOne))
    .delete(catchAsync(categories.deleteOne))

module.exports = router