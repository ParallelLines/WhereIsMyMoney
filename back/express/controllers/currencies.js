const db = require('../db')

module.exports.getAll = async (req, res) => {
    const currencies = await db.query(db.currencies.getAll)
    res.json(currencies.rows)
}

module.exports.getOne = async (req, res) => {
    const { name } = req.params
    const currencies = await db.query(db.currencies.getOne, [name])
    res.json(currencies.rows)
}

module.exports.create = async (req, res) => {
    const newData = req.body
    const result = await db.query(db.currencies.createOne, [
        newData.name,
        newData.symbol
    ])
    res.send('done')
}

module.exports.editOne = async (req, res) => {
    const { name } = req.params
    const currencyRes = await db.query(db.currencies.getOne, [name])
    const currency = currencyRes.rows[0]
    if (currency) {
        currency.name = req.body.name ? req.body.name : currency.name
        currency.symbol = req.body.symbol ? req.body.symbol : currency.symbol
        const result = await db.query(db.currencies.updateOne, [
            name,
            currency.name,
            currency.symbol
        ])
        const editedCurrency = await db.query(db.currencies.getOne, [name])
        res.json(editedCurrency.rows)
    } else {
        res.send('no such record')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { name } = req.params
    const result = await db.query(db.currencies.deleteOne, [name])
    res.send('done')
}