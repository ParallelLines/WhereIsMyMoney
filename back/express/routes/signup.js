const express = require('express')
const router = express.Router()
const { signUp } = require('../controllers/auth')
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .post(catchAsync(signUp))

module.exports = router