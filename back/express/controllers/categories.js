const db = require('../db')

module.exports.getAll = async (req, res) => {
    const { userId } = req
    try {
        const categories = await db.query(db.categories.getAllRecursive, [userId])
        console.log(categories.rows)
        res.json(categories.rows)
    } catch (e) {
        console.log('error while getAll categories: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.getOne = async (req, res) => {
    const { userId } = req
    const { id } = req.params
    try {
        const category = await db.query(db.categories.getOne, [userId, id])
        res.json(category.rows)
    } catch (e) {
        console.log('error while getOne categories: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.create = async (req, res) => {
    const newData = req.body
    const { userId } = req
    try {
        await db.query(db.categories.createOne, [
            userId,
            newData.name,
            newData.parent_id,
            newData.color
        ])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while create categories: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.editOne = async (req, res) => {
    const { userId } = req
    const { id } = req.params
    const { name, color } = req.body
    try {
        const categoryRes = await db.query(db.categories.getOne, [userId, id])
        const category = categoryRes.rows[0]
        if (category) {
            category.name = name ? name : category.name
            category.color = color ? color : category.color
            await db.query(db.categories.updateOne, [
                id,
                category.name,
                category.color
            ])
            res.sendStatus(200)
        } else {
            res.status(500).send('no such category :(')
        }
    } catch (e) {
        console.log('error while editOne categories: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { userId } = req
    const { id } = req.params
    try {
        await db.query(db.categories.deleteOne, [userId, id])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while deleteOne categories: ', e.code)
        res.status(500).send('something went wrong :(')
    }
}