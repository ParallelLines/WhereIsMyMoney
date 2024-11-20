const db = require('../db')
const HttpError = require('../utils/HttpError')
const { datesEqual } = require('../utils/dateUtils')
const { arraysEqual } = require('../utils/arrayUtils')
const { isCategoryValid } = require('./categories')

module.exports.getAll = async (req, res) => {
    const { userId } = req
    const regulars = await db.query(db.regulars.getAll, [userId])
    res.json(regulars.rows)
}

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    const regular = await db.query(db.regulars.getOne, [userId, id])
    res.json(regular.rows)
}

module.exports.create = async (req, res) => {
    const { userId } = req
    const newData = req.body
    newData.userId = userId
    newData.next_date = calculateNextDate()
    console.info('create regular: ', newData)
    const result = await createRegular(newData)
    res.json(result)
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    const regularRes = await db.query(db.regulars.getOne, [userId, id])
    const regular = regularRes.rows[0]
    if (!regular) {
        res.status(500).send('no such regular :(')
    }
    if (repeatPatternChanged(regular, req.body)) {
        //re-calculate next_date
        console.log('pattern changed')
    }
    if (req.body.category_id) {
        const isCatValid = await isCategoryValid(req.body.category_id, userId)
        if (!isCatValid) {
            res.status(400).send('cannot use this category')
            return
        }
    }
    regular.category_id = req.body.category_id ? req.body.category_id : regular.category_id
    regular.name = req.body.name ? req.body.name : regular.name
    regular.sum = req.body.sum ? req.body.sum : regular.sum
    regular.currency = req.body.currency ? req.body.currency : regular.currency
    regular.start_date = req.body.start_date ? req.body.start_date : regular.start_date
    regular.end_date = req.body.end_date ? req.body.end_date : regular.end_date
    regular.repeat_interval = req.body.repeat_interval ? req.body.repeat_interval : regular.repeat_interval
    regular.repeat_every = req.body.repeat_every ? req.body.repeat_every : regular.repeat_every
    regular.repeat_each_weekday = req.body.repeat_each_weekday ? req.body.repeat_each_weekday : regular.repeat_each_weekday
    regular.repeat_each_day_of_month = req.body.repeat_each_day_of_month ? req.body.repeat_each_day_of_month : regular.repeat_each_day_of_month
    regular.repeat_each_month = req.body.repeat_each_month ? req.body.repeat_each_month : regular.repeat_each_month
    regular.repeat_on_day_num = req.body.repeat_on_day_num ? req.body.repeat_on_day_num : regular.repeat_on_day_num
    regular.repeat_on_weekday = req.body.repeat_on_weekday ? req.body.repeat_on_weekday : regular.repeat_on_weekday
    await db.query(db.regulars.updateOne, [
        userId,
        id,
        regular.category_id,
        regular.name,
        regular.sum,
        regular.currency,
        regular.start_date,
        regular.end_date,
        regular.next_date,
        regular.repeat_interval,
        regular.repeat_every,
        regular.repeat_each_weekday,
        regular.repeat_each_day_of_month,
        regular.repeat_each_month,
        regular.repeat_on_day_num,
        regular.repeat_on_weekday
    ])
    res.sendStatus(200)
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    await db.query(db.regulars.deleteOne, [userId, id])
    res.sendStatus(200)
}

function repeatPatternChanged(oldData, newData) {
    return !datesEqual(newData.start_date, oldData.start_date) ||
        !datesEqual(newData.end_date, oldData.end_date) ||
        newData.repeat_interval !== oldData.repeat_interval ||
        parseInt(newData.repeat_every) !== parseInt(oldData.repeat_every) ||
        !arraysEqual(newData.repeat_each_weekday, oldData.repeat_each_weekday) ||
        !arraysEqual(newData.repeat_each_day_of_month, oldData.repeat_each_day_of_month) ||
        !arraysEqual(newData.repeat_each_month, oldData.repeat_each_month) ||
        newData.repeat_on_day_num !== oldData.repeat_on_day_num ||
        newData.repeat_on_weekday !== oldData.repeat_on_weekday
}

async function createRegular(regularData) {
    const isCatValid = await isCategoryValid(regularData.category_id, regularData.userId)
    if (!isCatValid) {
        throw new HttpError(400, 'cannot use this category')
    }
    const result = await db.query(db.regulars.createOne, [
        regularData.userId,
        regularData.category_id,
        regularData.name,
        regularData.sum,
        regularData.currency,
        regularData.start_date,
        regularData.end_date,
        regularData.next_date,
        regularData.repeat_interval,
        regularData.repeat_every,
        regularData.repeat_each_weekday,
        regularData.repeat_each_day_of_month,
        regularData.repeat_each_month,
        regularData.repeat_on_day_num,
        regularData.repeat_on_weekday
    ])
    return result.rows
}

function calculateNextDate() {
    return null
}
