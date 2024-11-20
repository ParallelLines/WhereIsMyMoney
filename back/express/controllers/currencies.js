const db = require('../db')

module.exports.getAll = async (req, res) => {
    const { userId } = req
    const currencies = await db.query(db.currencies.getAllOrdered, [userId])
    res.json(currencies.rows)
}

module.exports.getOne = async (req, res) => {
    const { name } = req.params
    const currencies = await db.query(db.currencies.getOne, [name])
    res.json(currencies.rows)
}

module.exports.create = async (req, res) => {
    const newData = req.body
    await db.query(db.currencies.createOne, [
        newData.name,
        newData.symbol
    ])
    res.sendStatus(200)
}

module.exports.editOne = async (req, res) => {
    const { name } = req.params
    const currencyRes = await db.query(db.currencies.getOne, [name])
    const currency = currencyRes.rows[0]
    if (currency) {
        currency.name = req.body.name ? req.body.name : currency.name
        currency.symbol = req.body.symbol ? req.body.symbol : currency.symbol
        await db.query(db.currencies.updateOne, [
            name,
            currency.name,
            currency.symbol
        ])
        res.sendStatus(200)
    } else {
        res.status(400).send('no such currency :(')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { name } = req.params
    await db.query(db.currencies.deleteOne, [name])
    res.sendStatus(200)
}