const db = require('../db')

module.exports.getAll = async (req, res) => {
    const expenses = await db.query(db.expenses.getAll)
    res.json(expenses.rows)
}

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const expense = await db.query(db.expenses.getOne, [id])
    res.json(expense.rows)
}

module.exports.create = async (req, res) => {
    const newData = req.body
    newData.inUSD = 0
    newData.regular_name = null
    newData.reqular_id = null
    const result = await db.query(db.expenses.createOne, [
        newData.user_id,
        newData.category_id,
        newData.name,
        newData.sum,
        newData.inUSD,
        newData.currency,
        newData.reqular_id,
        newData.regular_name
    ])
    res.send('done')
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const expenseRes = await db.query(db.expenses.getOne, [id])
    const expense = expenseRes.rows[0]
    if (expense) {
        if (req.body.sum !== expense.sum) {
            //add logic for inUSD
            expense.inUSD = 1
        }
        expense.category_id = req.body.category_id ? req.body.category_id : expense.category_id
        expense.name = req.body.name ? req.body.name : expense.name
        expense.sum = req.body.sum ? req.body.sum : expense.sum
        expense.currency = req.body.currency ? req.body.currency : expense.currency
        expense.date = req.body.date ? req.body.date : expense.date
        const result = await db.query(db.expenses.updateOne, [
            id,
            expense.category_id,
            expense.name,
            expense.sum,
            expense.inUSD,
            expense.currency,
            expense.date
        ])
        const editedExpense = await db.query(db.expenses.getOne, [id])
        res.json(editedExpense.rows)
    } else {
        res.send('no such record')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    const result = await db.query(db.expenses.deleteOne, [id])
    res.send('done')
}