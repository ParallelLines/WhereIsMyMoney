const db = require('../db')
const HttpError = require('../utils/HttpError')

const ratesURL = process.env.CURRENCY_RATES_URL
const ratesVersion = process.env.CURRENCY_RATES_API_VERSION
const ratesEndpoint1 = process.env.CURRENCY_RATES_ENPOINT_1

module.exports.getAll = async (req, res) => {
    const { userId } = req
    try {
        const expenses = await db.query(db.expenses.getAll, [userId])
        res.json(expenses.rows)
    } catch (e) {
        console.error('error while getAll expenses: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    try {
        const expense = await db.query(db.expenses.getOne, [userId, id])
        res.json(expense.rows)
    } catch (e) {
        console.error('error while getOne expenses: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.create = async (req, res) => {
    const { userId } = req
    const newData = req.body
    newData.userId = userId
    console.info('create expense: ', newData)
    try {
        const result = await createExpense(newData)
        res.json(result)
    } catch (e) {
        console.error('error while create: ', e)
        res.status(e.status ? e.status : 500).send(e.status ? e.message : 'something went wrong :(')
    }
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    try {
        const expenseRes = await db.query(db.expenses.getOne, [userId, id])
        const expense = expenseRes.rows[0]
        if (expense) {
            if (req.body.sum !== expense.sum) {
                //add logic for recalculating inUSD
                expense.inUSD = 1
            }
            if (req.body.category_id) {
                const isCatValid = await isCategoryValid(req.body.category_id, userId)
                if (!isCatValid) {
                    res.status(400).send('cannot use this category')
                    return
                }
            }
            expense.category_id = req.body.category_id ? req.body.category_id : expense.category_id
            expense.name = req.body.name ? req.body.name : expense.name
            expense.sum = req.body.sum ? req.body.sum : expense.sum
            expense.currency = req.body.currency ? req.body.currency : expense.currency
            expense.date = req.body.date ? req.body.date : expense.date
            await db.query(db.expenses.updateOne, [
                userId,
                id,
                expense.category_id,
                expense.name,
                expense.sum,
                expense.inUSD,
                expense.currency,
                expense.date
            ])
            res.sendStatus(200)
        } else {
            res.status(500).send('no such expense :(')
        }
    } catch (e) {
        console.error('error while editOne expenses: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    try {
        await db.query(db.expenses.deleteOne, [userId, id])
        res.sendStatus(200)
    } catch (e) {
        console.error('error while deleteOne expenses: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

async function createExpense(expenseData) {
    expenseData.inUSD = await calculateUSD(expenseData.sum, expenseData.date, expenseData.currency)
    expenseData.regular_name = null
    expenseData.reqular_id = null
    const isCatValid = await isCategoryValid(expenseData.category_id, expenseData.userId)
    if (!isCatValid) {
        throw new HttpError(400, 'cannot use this category')
    }
    try {
        const result = await db.query(db.expenses.createOne, [
            expenseData.userId,
            expenseData.category_id,
            expenseData.name,
            expenseData.sum,
            expenseData.inUSD,
            expenseData.currency,
            expenseData.reqular_id,
            expenseData.regular_name,
            expenseData.date
        ])
        return result.rows
    } catch (e) {
        console.error('error while createExpense: ', e.code)
        throw new HttpError(500, 'something went wrong :(')
    }
}

async function isCategoryValid(categoryId, userId) {
    try {
        const category = await db.query(db.categories.getOne, [userId, categoryId])
        return category.rows.length === 1
    } catch (e) {
        console.error('error while isCategoryValid expenses: ', e.code)
        return null
    }
}

/**
 * 
 * @param {String} sum  '13.45', '45.00'.
 * @param {String} date '2024-10-01T17:45'.
 * @param {*} currency  'USD', 'EUR', etc.
 */
async function calculateUSD(sum, date, currency) {
    try {
        const num = parseFloat(sum)
        const day = date.split('T')[0]
        const ratesExist = await checkIfRatesExist(day)
        if (!ratesExist) {
            const freshRates = await getRatesFromOutside(day)
            await insertRatesInDB(freshRates)
        }
        const rate = await getRateFromDB(day, currency)
        return num / rate
    } catch (e) {
        console.error('error while calculateUSD: ', e.code)
        return 0
    }
}

/**
 * With a DB query checks if at least one row with such date exists.
 * 
 * @param {String} date '2024-08-31'.
 * @returns {Boolean}   true if rates exist and false if not
 */
async function checkIfRatesExist(date) {
    try {
        const result = await db.query(db.rates.checkExistenceByDate, [date])
        return result.rows[0].exists
    } catch (e) {
        console.error('error while checkIfRatesExist: ', e.code)
        return null
    }
}

/**
 * Selects from table 'rates' records for the date and currency
 * 
 * @param {String} date     '2024-08-31'.
 * @param {String} currency 'USD', 'EUR', etc.
 * @returns {Number}   returns the float number for rate
 */
async function getRateFromDB(date, currency) {
    try {
        const rates = await db.query(db.rates.getRateByDateAndCurrency, [date, currency])
        return parseFloat(rates.rows[0].rate)
    } catch (e) {
        console.error('error while getRatesFromDB: ', e.code)
        return null
    }
}

/**
 * Fetches rates and returns them as an Object.
 * 
 * @param {String} date     '2024-08-31', or 'latest' by default.
 * @param {String} currency 'USD', 'EUR', etc.
 * 
 * @returns {Object} Example: {date: '2024-08-31', 'usd': {'eur': 0.90167411, etc}}.
 */
async function getRatesFromOutside(date = 'latest', currency = 'USD') {
    //https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-10-16/v1/currencies/usd.json
    const url = `${ratesURL}@${date}/${ratesVersion}/${ratesEndpoint1}/${currency.toLowerCase()}.json`
    try {
        const response = await fetch(url)
        const rates = await response.json()
        return rates
    } catch (e) {
        console.error('error while getRatesFromOutside', e)
    }
}
/**
 * Inserts into table 'rates'
 * 
 * Writes into the table 'rates' new rates for the given currency and the given date 
 * (which is inside the 'data' Object), and it only takes those currencies from data object, which 
 * we have in our table 'currencies'
 * 
 * @param {Object} data     Example: {date: '2024-08-31', 'usd': {'eur': 0.90167411, ...}}.
 * @param {String} currency Examples: 'USD', 'EUR', but is USD by default.
 */
async function insertRatesInDB(data, currency = 'USD') {
    try {
        const result = await db.query(db.currencies.getAll)
        const currencies = result.rows
        const date = data.date
        const rates = data[currency.toLowerCase()]
        const queryParts = []
        for (let curr of currencies) {
            const rate = rates[curr.name.toLowerCase()]
            queryParts.push(`('${date}', '${curr.name}', '${currency}', ${rate})`)
        }
        const query = 'INSERT INTO rates (date, from_currency, to_currency, rate) VALUES ' + queryParts.join(',')
        await db.query(query)
    } catch (e) {
        console.error('error while updating rates: ', e.code)
    }
}
