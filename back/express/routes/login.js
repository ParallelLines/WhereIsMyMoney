const express = require('express')
const router = express.Router()
const { logIn } = require('../controllers/auth')
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .post(catchAsync(logIn))

module.exports = router