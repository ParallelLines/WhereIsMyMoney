const db = require('../db')

module.exports.getAll = async (req, res) => {
    const { userId } = req
    try {
        const currencies = await db.query(db.currencies.getAllOrdered, [userId])
        res.json(currencies.rows)
    } catch (e) {
        console.log('error while getAll currencies: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.getOne = async (req, res) => {
    const { name } = req.params
    try {
        const currencies = await db.query(db.currencies.getOne, [name])
        res.json(currencies.rows)
    } catch (e) {
        console.log('error while getOne currencies: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.create = async (req, res) => {
    const newData = req.body
    try {
        await db.query(db.currencies.createOne, [
            newData.name,
            newData.symbol
        ])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while create currencies: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.editOne = async (req, res) => {
    const { name } = req.params
    try {
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
    } catch (e) {
        console.log('error while editOne currencies: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { name } = req.params
    try {
        await db.query(db.currencies.deleteOne, [name])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while deleteOne currencies: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}