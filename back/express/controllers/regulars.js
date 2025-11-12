const db = require('../db')
const HttpError = require('../utils/HttpError')
const { datesEqual, calculateNextDate } = require('../utils/dateUtils')
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

module.exports.getNextDate = async (req, res) => {
    if (!isPatternValid(req.body)) {
        res.status(400).send('repeat pattern is invalid :(')
        return
    }
    result = {}
    const prev_date = req.body.prev_date ? new Date(req.body.prev_date) : null
    result.next_date = calculateNextDate(prev_date, req.body)
    res.json(result)
}

module.exports.create = async (req, res) => {
    const { userId } = req
    const newData = req.body
    newData.userId = userId
    console.info('create regular: ', newData)

    if (!isPatternValid(req.body)) {
        res.status(400).send('repeat pattern is invalid :(')
        return
    }

    const result = await createRegular(newData)
    res.json(result)
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req

    if (!isPatternValid(req.body)) {
        res.status(400).send('repeat pattern is invalid :(')
        return
    }

    const regularRes = await db.query(db.regulars.getOne, [userId, id])
    const regular = regularRes.rows[0]
    if (!regular) {
        res.status(400).send('no such regular :(')
    }
    if (repeatPatternChanged(regular, req.body)) {
        const prevDate = new Date()
        const nextDate = calculateNextDate(prevDate, req.body)
        if (nextDate === -1) throw new Error('Error while calculating next date')
        if (nextDate) {
            regular.next_date = nextDate.toISOString()
            console.log('next date re-calcuated: ', regular.next_date)
        } else {
            regular.next_date = null
            console.info(`regular id ${id} is ended and won't be executed further`)
        }
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
    regular.start_date = req.body.start_date !== undefined ? req.body.start_date : regular.start_date
    regular.end_date = req.body.end_date !== undefined ? req.body.end_date : regular.end_date
    regular.repeat_interval = req.body.repeat_interval !== undefined ? req.body.repeat_interval : regular.repeat_interval
    regular.repeat_every = req.body.repeat_every !== undefined ? req.body.repeat_every : regular.repeat_every
    regular.repeat_each_weekday = req.body.repeat_each_weekday !== undefined ? req.body.repeat_each_weekday : regular.repeat_each_weekday
    regular.repeat_each_day_of_month = req.body.repeat_each_day_of_month !== undefined ? req.body.repeat_each_day_of_month : regular.repeat_each_day_of_month
    regular.repeat_each_month = req.body.repeat_each_month !== undefined ? req.body.repeat_each_month : regular.repeat_each_month
    regular.repeat_on_day_num = req.body.repeat_on_day_num !== undefined ? req.body.repeat_on_day_num : regular.repeat_on_day_num
    regular.repeat_on_weekday = req.body.repeat_on_weekday !== undefined ? req.body.repeat_on_weekday : regular.repeat_on_weekday
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
    const { userId } = req
    const { id } = req.params
    if (!id) {
        throw new HttpError(400, 'empty request')
    }
    await db.query(db.regulars.deleteOne, [userId, id])
    res.sendStatus(200)
}

module.exports.deleteMany = async (req, res) => {
    const { userId } = req
    const { ids } = req.body
    if (!ids || !ids.length) {
        throw new HttpError(400, 'empty request')
    }
    const offset = 2
    const placeholders = ids.map((val, i) => '$' + (i + offset)).join(', ')
    await db.query(db.regulars.deleteMany + '(' + placeholders + ')', [userId, ...ids])
    res.sendStatus(200)
}

async function createRegular(regularData) {
    const isCatValid = await isCategoryValid(regularData.category_id, regularData.userId)
    if (!isCatValid) {
        throw new HttpError(400, 'cannot use this category')
    }
    const prev_date = req.body.prev_date ? new Date(req.body.prev_date) : null
    regularData.next_date = calculateNextDate(prev_date, regularData)
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

function isPatternValid(pattern) {
    console.info('Validating the pattern for a regular: ', pattern)

    if (pattern.start_date === undefined ||
        pattern.end_date === undefined ||
        pattern.repeat_interval === undefined ||
        pattern.repeat_every === undefined ||
        pattern.repeat_each_weekday === undefined ||
        pattern.repeat_each_day_of_month === undefined ||
        pattern.repeat_each_month === undefined ||
        pattern.repeat_on_day_num === undefined ||
        pattern.repeat_on_weekday === undefined) {
        console.error('One of the following params is undefined: start_date, end_date, repeat_interval, repeat_every, repeat_each_weekday, repeat_each_day_of_month, repeat_each_month, repeat_on_day_num, repeat_on_weekday. \nThey should all be present in the request, even tho they can be null.')
        return false
    }

    if (!pattern.start_date || !pattern.repeat_interval || !pattern.repeat_every) {
        console.error('start_date, repeat_interval or repeat_every should never be null.')
        return false
    }

    if (pattern.repeat_every <= 0) {
        console.error('repeat_every should be more than 0.')
    }

    const freq = pattern.repeat_interval
    switch (freq) {
        case 'daily': {
            const allNull = pattern.repeat_each_weekday === null &&
                pattern.repeat_each_day_of_month === null &&
                pattern.repeat_each_month === null &&
                pattern.repeat_on_day_num === null &&
                pattern.repeat_on_weekday === null
            if (!allNull) console.error('when repeat interval is "daily" the following params should be null: repeat_each_weekday, repeat_each_day_of_month, repeat_each_month, repeat_on_day_num, repeat_on_weekday.')
            return allNull
        }
        case 'weekly': {
            if (!pattern.repeat_each_weekday) {
                console.error('when repeat interval is "weekly" repeat_each_weekday should not be null.')
                return false
            }
            if (pattern.repeat_each_weekday.length < 1) {
                console.error('when repeat interval is "weekly" repeat_each_weekday should contain at least one day of week.')
                return false
            }
            const allNull = pattern.repeat_each_day_of_month === null &&
                pattern.repeat_each_month === null &&
                pattern.repeat_on_day_num === null &&
                pattern.repeat_on_weekday === null
            if (!allNull) console.error('when repeat interval is "weekly" the following params should be null: repeat_each_day_of_month, repeat_each_month, repeat_on_day_num, repeat_on_weekday.')
            return allNull
        }
        case 'monthly': {
            // TODO: check here if pattern.repeat_each_day_of_month === undeined and return false if it is?
            if (pattern.repeat_each_day_of_month) {
                if (pattern.repeat_each_day_of_month.length < 1) {
                    console.error('when repeat interval is "monthly" repeat_each_day_of_month should contain at least one day of month.')
                    return false
                }
                if (pattern.repeat_on_day_num || pattern.repeat_on_weekday) {
                    console.error('when repeat interval is "monthly" and repeat_each_day_of_month exists the following params should be null: repeat_on_day_num, repeat_on_weekday.')
                    return false
                }
            } else {
                if (!pattern.repeat_on_day_num || !pattern.repeat_on_weekday) {
                    console.error('when repeat interval is "monthly" and repeat_each_day_of_month is null the following params should not be null: repeat_on_day_num, repeat_on_weekday.')
                    return false
                }
            }
            const allNull = pattern.repeat_each_weekday === null && pattern.repeat_each_month === null
            if (!allNull) console.error('when repeat interval is "monthly" the following params should be null: repeat_each_weekday, repeat_each_month.')
            return allNull
        }
        case 'yearly': {
            if (!pattern.repeat_each_month) {
                console.error('when repeat interval is "yearly" repeat_each_month should not be null.')
                return false
            }
            if (pattern.repeat_each_month.length < 1) {
                console.error('when repeat interval is "yearly" repeat_each_month should contain at least one day of week.')
                return false
            }
            if (!pattern.repeat_on_day_num !== !pattern.repeat_on_weekday) {
                console.error('when repeat interval is "yearly" repeat_on_day_num and repeat_on_weekday should both be null or not null.')
                return false
            }
            const allNull = pattern.repeat_each_weekday === null && pattern.repeat_each_day_of_month === null
            if (!allNull) console.error('when repeat interval is "yearly" the following params should be null: repeat_each_weekday, repeat_each_day_of_month.')
            return allNull
        }
        default: {
            console.error('Unknown repeat interval: ', freq)
            return false
        }
    }
}
