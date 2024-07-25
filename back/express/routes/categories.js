const express = require('express')
const router = express.Router()
const categories = require('../controllers/categories')
const catchAsync = require('../utils/catchAsync')
const { verifyJWT } = require('../middleware')

router.use(verifyJWT)

router.route('/:userId')
    .get(catchAsync(categories.getAll))
    .post(catchAsync(categories.create))

router.route('/:userId/:id')
    .get(catchAsync(categories.getOne))
    .put(catchAsync(categories.editOne))
    .delete(catchAsync(categories.deleteOne))

module.exports = router