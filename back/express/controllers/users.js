const db = require('../db')

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    try {
        const user = await db.query(db.users.getOne, [id])
        res.json(user.rows)
    } catch (e) {
        console.error('error while getOne users: ', e)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.create = async (req, res) => {
    const newData = req.body
    try {
        await db.query(db.users.createOne, [
            newData.name,
            newData.password
        ])
        res.sendStatus(200)
    } catch (e) {
        console.error('error while create users: ', e)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    try {
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
    } catch (e) {
        console.error('error while editOne users: ', e)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    try {
        await db.query(db.users.deleteOne, [id])
        res.sendStatus(200)
    } catch (e) {
        console.error('error while deleteOne users: ', e)
        res.status(500).send('something went wrong :(')
    }
}