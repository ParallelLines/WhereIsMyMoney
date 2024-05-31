const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .post(catchAsync(users.create))

router.route('/:id')
    .get(catchAsync(users.getOne))
    .put(catchAsync(users.editOne))
    .delete(catchAsync(users.deleteOne))

module.exports = router