const express = require('express')
const router = express.Router()
const regulars = require('../controllers/regulars')
const catchAsync = require('../utils/catchAsync')
const { verifyJWT } = require('../middleware')

router.use(verifyJWT)

router.route('/')
    .get(catchAsync(regulars.getAll))
    .post(catchAsync(regulars.create))
    .delete(catchAsync(regulars.deleteMany))

router.route('/nextDate')
    .post(catchAsync(regulars.getNextDate))

router.route('/:id')
    .get(catchAsync(regulars.getOne))
    .put(catchAsync(regulars.editOne))
    .delete(catchAsync(regulars.deleteOne))

module.exports = router