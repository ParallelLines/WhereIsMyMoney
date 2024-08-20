const db = require('../db')

module.exports.getAll = async (req, res) => {
    const { userId } = req
    try {
        const expenses = await db.query(db.expenses.getAll, [userId])
        res.json(expenses.rows)
    } catch (e) {
        console.log('error while getAll expenses: ', e.code)
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
        console.log('error while getOne expenses: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.create = async (req, res) => {
    const { userId } = req
    const newData = req.body
    console.log(newData)
    newData.inUSD = 0
    newData.regular_name = null
    newData.reqular_id = null
    const isCatValid = await isCategoryValid(newData.category_id, userId)
    if (!isCatValid) {
        res.status(400).send('cannot use this category')
        return
    }
    try {
        const result = await db.query(db.expenses.createOne, [
            userId,
            newData.category_id,
            newData.name,
            newData.sum,
            newData.inUSD,
            newData.currency,
            newData.reqular_id,
            newData.regular_name
        ])
        res.json(result.rows)
    } catch (e) {
        console.log('error while create expenses: ', e.code)
        res.status(500).send('something went wrong :(')
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
            console.log(expense)
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
        console.log('error while editOne expenses: ', e.code)
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
        console.log('error while deleteOne expenses: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

async function isCategoryValid(categoryId, userId) {
    try {
        const category = await db.query(db.categories.getOne, [userId, categoryId])
        return category.rows.length === 1
    } catch (e) {
        console.log('error while isCategoryValid expenses: ', e.code)
        return null
    }
}
