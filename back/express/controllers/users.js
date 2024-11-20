const db = require('../db')

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const user = await db.query(db.users.getOne, [id])
    res.json(user.rows)
}

module.exports.create = async (req, res) => {
    const newData = req.body
    await db.query(db.users.createOne, [
        newData.name,
        newData.password
    ])
    res.sendStatus(200)
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const userRes = await db.query(db.users.getOne, [id])
    const user = userRes.rows[0]
    if (user) {
        user.name = req.body.name ? req.body.name : user.name
        user.password = req.body.password ? req.body.password : user.password
        await db.query(db.users.updateOne, [
            id,
            user.name,
            user.password
        ])
        res.sendStatus(200)
    } else {
        res.status(400).send('no such user :(')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    await db.query(db.users.deleteOne, [id])
    res.sendStatus(200)
}