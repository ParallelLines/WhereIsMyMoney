import db from '../db.js'

export async function getAll(req, res) {
    const { userId } = req
    const currencies = await db.query(db.currencies.getAllOrdered, [userId])
    res.json(currencies.rows)
}

export async function getOne(req, res) {
    const { name } = req.params
    const currencies = await db.query(db.currencies.getOne, [name])
    res.json(currencies.rows)
}

export async function create(req, res) {
    const newData = req.body
    await db.query(db.currencies.createOne, [
        newData.name,
        newData.symbol
    ])
    res.sendStatus(200)
}

export async function editOne(req, res) {
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

export async function deleteOne(req, res) {
    const { name } = req.params
    await db.query(db.currencies.deleteOne, [name])
    res.sendStatus(200)
}