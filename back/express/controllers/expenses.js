const db = require('../db')

module.exports.getAll = async (req, res) => {
    const userId = '2'
    try {
        const expenses = await db.query(db.expenses.getAll, [userId])
        res.json(expenses.rows)
    } catch (e) {
        console.log('error while getAll expenses: ', e.code)
        res.sendStatus(500)
    }
}

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    try {
        const expense = await db.query(db.expenses.getOne, [id])
        res.json(expense.rows)
    } catch (e) {
        console.log('error while getOne expenses: ', e.code)
        res.sendStatus(500)
    }
}

module.exports.create = async (req, res) => {
    const newData = req.body
    newData.inUSD = 0
    newData.regular_name = null
    newData.reqular_id = null

    const isCatValid = await isCategoryValid(newData.category_id, newData.user_id)
    if (!isCatValid) {
        res.sendStatus(400)
        return
    }

    try {
        await db.query(db.expenses.createOne, [
            newData.user_id,
            newData.category_id,
            newData.name,
            newData.sum,
            newData.inUSD,
            newData.currency,
            newData.reqular_id,
            newData.regular_name
        ])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while create expenses: ', e.code)
        res.sendStatus(500)
    }
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    try {
        const expenseRes = await db.query(db.expenses.getOne, [id])
        const expense = expenseRes.rows[0]
        if (expense) {
            if (req.body.sum !== expense.sum) {
                //add logic for inUSD
                expense.inUSD = 1
            }
            if (req.body.category_id) {
                const isCatValid = await isCategoryValid(req.body.category_id, expense.user_id)
                if (!isCatValid) {
                    res.sendStatus(400)
                    return
                }
            }
            expense.category_id = req.body.category_id ? req.body.category_id : expense.category_id
            expense.name = req.body.name ? req.body.name : expense.name
            expense.sum = req.body.sum ? req.body.sum : expense.sum
            expense.currency = req.body.currency ? req.body.currency : expense.currency
            expense.date = req.body.date ? req.body.date : expense.date
            await db.query(db.expenses.updateOne, [
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
            res.sendStatus(400)
        }
    } catch (e) {
        console.log('error while editOne expenses: ', e.code)
        res.sendStatus(500)
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    try {
        await db.query(db.expenses.deleteOne, [id])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while deleteOne expenses: ', e.code)
        res.sendStatus(500)
    }
}

async function isCategoryValid(category_id, user_id) {
    try {
        const category = await db.query(db.categories.getOneByUser, [category_id, user_id])
        return category.rows.length === 1
    } catch (e) {
        console.log('error while isCategoryValid expenses: ', e.code)
        return null
    }
}
