const db = require('../db')

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const user = await db.query(db.users.getOne, [id])
    res.json(user.rows)
}

module.exports.create = async (req, res) => {
    const newData = req.body
    const result = await db.query(db.users.createOne, [
        newData.name,
        newData.password
    ])
    res.send('done')
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const userRes = await db.query(db.users.getOne, [id])
    const user = userRes.rows[0]
    if (user) {
        user.name = req.body.name ? req.body.name : user.name
        user.password = req.body.password ? req.body.password : user.password
        const result = await db.query(db.users.updateOne, [
            id,
            user.name,
            user.password
        ])
        res.json('done')
    } else {
        res.send('no such record')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    const result = await db.query(db.users.deleteOne, [id])
    res.send('done')
}