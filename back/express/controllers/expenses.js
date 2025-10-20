const db = require('../db')
const HttpError = require('../utils/HttpError')
const { datesEqual } = require('../utils/dateUtils')
const { isCategoryValid } = require('./categories')

const ratesURL = process.env.CURRENCY_RATES_URL
const ratesVersion = process.env.CURRENCY_RATES_API_VERSION
const ratesEndpoint1 = process.env.CURRENCY_RATES_ENPOINT_1

module.exports.getAll = async (req, res) => {
    const { userId } = req
    let { page = 1, elementsProPage = 10 } = req.query
    const expenses = await db.query(db.expenses.getAllByPage, [userId, elementsProPage, elementsProPage * (page - 1)])
    res.json(expenses.rows)
}

module.exports.getNamesByPrefix = async (req, res) => {
    let { prefix } = req.params
    const { userId } = req
    prefix += '%'
    const names = await db.query(db.expenses.getNamesByPrefix, [userId, prefix])
    res.json(names.rows)
}

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    const expense = await db.query(db.expenses.getOne, [userId, id])
    res.json(expense.rows)
}

module.exports.create = async (req, res) => {
    const { userId } = req
    const newData = req.body
    newData.userId = userId
    console.info('create expense: ', newData)
    const result = await createExpense(newData)
    res.json(result)
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    const expenseRes = await db.query(db.expenses.getOne, [userId, id])
    const expense = expenseRes.rows[0]
    if (!expense) {
        throw new HttpError(400, 'no such expense :(')
    }
    if (req.body.sum && parseFloat(req.body.sum) !== parseFloat(expense.sum) ||
        req.body.date && !datesEqual(req.body.date, expense.date) ||
        req.body.currency && req.body.currency !== expense.currency ||
        !expense.inusd || expense.inusd === -1) {
        console.log('calculating inUSD...')
        expense.inusd = await calculateUSD(req.body.sum, req.body.date, req.body.currency)
    }
    if (req.body.category_id) {
        const isCatValid = await isCategoryValid(req.body.category_id, userId)
        if (!isCatValid) {
            throw new HttpError(400, 'cannot use this category')
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
        expense.inusd,
        expense.currency,
        expense.date
    ])
    res.sendStatus(200)
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    const { userId } = req
    await db.query(db.expenses.deleteOne, [userId, id])
    res.sendStatus(200)
}

async function createExpense(expenseData) {
    expenseData.inUSD = await calculateUSD(expenseData.sum, expenseData.date, expenseData.currency)
    expenseData.regular_name = null
    expenseData.reqular_id = null
    const isCatValid = await isCategoryValid(expenseData.category_id, expenseData.userId)
    if (!isCatValid) {
        throw new HttpError(400, 'cannot use this category')
    }
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
        console.error(e)
        return -1
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
        console.error(e)
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
        console.error(e)
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
    //info: https://github.com/fawazahmed0/exchange-api/issues/90
    //https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-10-16/v1/currencies/usd.json
    const url = `${ratesURL}@${date}/${ratesVersion}/${ratesEndpoint1}/${currency.toLowerCase()}.json`
    const response = await fetch(url)
    const rates = await response.json()
    return rates
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
}
