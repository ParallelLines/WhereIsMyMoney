import db from '../db.js'
import HttpError from '../utils/HttpError.js'
import { datesEqual, calculateNextDate } from '../utils/dateUtils.js'
import { arraysEqual } from '../utils/arrayUtils.js'
import { isCategoryValid } from './categories.js'
import { createExpense } from './expenses.js'

export async function getAll(req, res) {
    const { userId } = req
    const { category = null } = req.query
    if (category && category !== 'null') {
        const regulars = await db.query(db.regulars.getAllByCategory, [userId, category])
        res.json(regulars.rows)
    } else {
        const regulars = await db.query(db.regulars.getAll, [userId])
        res.json(regulars.rows)
    }
}

export async function getOne(req, res) {
    const { id } = req.params
    const { userId } = req
    const regular = await db.query(db.regulars.getOne, [userId, id])
    res.json(regular.rows)
}

export async function getNextDate(req, res) {
    if (!isPatternValid(req.body)) {
        res.status(400).send('repeat pattern is invalid :(')
        return
    }
    const result = {}
    let prevDate
    if (req.body.prev_date) {
        prevDate = new Date(req.body.prevDate)
    } else {
        prevDate = await findLastExecution(req.body.id)
    }
    result.next_date = calculateNextDate(prevDate, req.body)
    res.json(result)
}

export async function create(req, res) {
    const { userId } = req
    const newData = req.body
    newData.userId = userId
    console.info('create regular: ', newData)

    if (!isPatternValid(req.body)) {
        res.status(400).send('repeat pattern is invalid :(')
        return
    }

    const prev_date = req.body.prev_date ? new Date(req.body.prev_date) : null
    const result = await createRegular(newData, prev_date)
    res.json(result)
}

export async function editOne(req, res) {
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
        regular.next_date = await reCalculateNextDate(regular, req.body)
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

export async function deleteOne(req, res) {
    const { userId } = req
    const { id } = req.params
    if (!id) {
        throw new HttpError(400, 'empty request')
    }
    await db.query(db.regulars.deleteOne, [userId, id])
    res.sendStatus(200)
}

export async function deleteMany(req, res) {
    const { userId } = req
    const { ids } = req.body
    if (!ids || !ids.length) {
        throw new HttpError(400, 'empty request')
    }
    const offset = 2
    const placeholders = ids.map((val, i) => '$' + (i + offset)).join(', ')
    await db.query(db.regulars.deleteMany + ' (' + placeholders + ')', [userId, ...ids])
    res.sendStatus(200)
}

export async function processRegulars() {
    const regulars = await getPendingRegulars()
    for (let regular of regulars) {
        await processPendingRegular(regular)
    }
}

async function getPendingRegulars() {
    const result = await db.query(db.regulars.getPending)
    return result.rows
}

async function processPendingRegular(regular) {
    let now = new Date()
    let date = new Date(regular.next_date)
    while (date && date !== -1 && (date < now || datesEqual(now, date))) {
        const expense = {
            user_id: regular.user_id,
            category_id: regular.category_id,
            name: regular.name,
            sum: regular.sum,
            currency: regular.currency,
            reqular_id: regular.id,
            date: date.toISOString()
        }
        await createExpense(expense)
        console.log(`expense created: ${expense.name} ${expense.date}`)
        date = calculateNextDate(date, regular)
    }
    const dateForDB = date && date instanceof Date ? date.toISOString() : null
    await db.query(db.regulars.updateNextDate, [regular.user_id, regular.id, dateForDB])
    console.log('new date was written into DB: ', dateForDB)
}

async function createRegular(regularData, prevDate) {
    const isCatValid = await isCategoryValid(regularData.category_id, regularData.userId)
    if (!isCatValid) {
        throw new HttpError(400, 'cannot use this category')
    }
    regularData.next_date = calculateNextDate(prevDate, regularData)
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

async function findLastExecution(regularId) {
    const dates = await db.query(db.regulars.getExecutionTimes, [regularId])
    if (dates.rows.length) return dates.rows[0].date
    return null
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
    if (pattern.start_date === undefined ||
        pattern.repeat_interval === undefined ||
        pattern.repeat_every === undefined ||
        pattern.repeat_each_weekday === undefined ||
        pattern.repeat_each_day_of_month === undefined ||
        pattern.repeat_each_month === undefined ||
        pattern.repeat_on_day_num === undefined ||
        pattern.repeat_on_weekday === undefined) {
        console.info('The pattern for a regular: ', pattern)
        console.error('One of the following params is undefined: start_date, end_date, repeat_interval, repeat_every, repeat_each_weekday, repeat_each_day_of_month, repeat_each_month, repeat_on_day_num, repeat_on_weekday. \nThey should all be present in the request, even tho they can be null.')
        return false
    }

    if (!pattern.start_date || !pattern.repeat_interval || !pattern.repeat_every) {
        console.info('The pattern for a regular: ', pattern)
        console.error('start_date, repeat_interval or repeat_every should never be null.')
        return false
    }

    if (pattern.repeat_every <= 0) {
        console.info('The pattern for a regular: ', pattern)
        console.error('repeat_every should be more than 0.')
    }

    const freq = pattern.repeat_interval
    switch (freq) {
        case 'daily': {
            return true
        }
        case 'weekly': {
            if (!pattern.repeat_each_weekday) {
                console.info('The pattern for a regular: ', pattern)
                console.error('when repeat interval is "weekly" repeat_each_weekday should not be null.')
                return false
            }
            if (pattern.repeat_each_weekday.length < 1) {
                console.info('The pattern for a regular: ', pattern)
                console.error('when repeat interval is "weekly" repeat_each_weekday should contain at least one day of week.')
                return false
            }
            return true
        }
        case 'monthly': {
            // TODO: check here if pattern.repeat_each_day_of_month === undeined and return false if it is?
            if (pattern.repeat_each_day_of_month) {
                if (pattern.repeat_each_day_of_month.length < 1) {
                    console.info('The pattern for a regular: ', pattern)
                    console.error('when repeat interval is "monthly" repeat_each_day_of_month should contain at least one day of month.')
                    return false
                }
                if (pattern.repeat_on_day_num || pattern.repeat_on_weekday) {
                    console.info('The pattern for a regular: ', pattern)
                    console.error('when repeat interval is "monthly" and repeat_each_day_of_month exists the following params should be null: repeat_on_day_num, repeat_on_weekday.')
                    return false
                }
            } else {
                if (!pattern.repeat_on_day_num || !pattern.repeat_on_weekday) {
                    console.info('The pattern for a regular: ', pattern)
                    console.error('when repeat interval is "monthly" and repeat_each_day_of_month is null the following params should not be null: repeat_on_day_num, repeat_on_weekday.')
                    return false
                }
            }
            return true
        }
        case 'yearly': {
            if (!pattern.repeat_each_month) {
                console.info('The pattern for a regular: ', pattern)
                console.error('when repeat interval is "yearly" repeat_each_month should not be null.')
                return false
            }
            if (pattern.repeat_each_month.length < 1) {
                console.info('The pattern for a regular: ', pattern)
                console.error('when repeat interval is "yearly" repeat_each_month should contain at least one month.')
                return false
            }
            if (!pattern.repeat_on_day_num !== !pattern.repeat_on_weekday) {
                console.info('The pattern for a regular: ', pattern)
                console.error('when repeat interval is "yearly" repeat_on_day_num and repeat_on_weekday should both be null or not null.')
                return false
            }
            return true
        }
        default: {
            console.info('The pattern for a regular: ', pattern)
            console.error('Unknown repeat interval: ', freq)
            return false
        }
    }
}

async function reCalculateNextDate(currRegular, newRegular) {
    const prevDate = await findLastExecution(currRegular.id)
    const nextDate = calculateNextDate(prevDate, newRegular)
    if (nextDate === -1) throw new Error('Error while calculating next date')
    if (nextDate) {
        console.log('next date re-calcuated: ', nextDate)
        return nextDate.toISOString()
    }
    console.info(`regular id ${currRegular.id} is ended and won't be executed further`)
    return null
}
