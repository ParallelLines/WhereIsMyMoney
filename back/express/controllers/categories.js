const db = require('../db')

module.exports.getAll = async (req, res) => {
    const { userId } = req.params
    try {
        const categories = await db.query(db.categories.getAll, [userId])
        res.json(categories.rows)
    } catch (e) {
        console.log('error while getAll categories: ', e.code)
        console.log('look for the error here: https://www.postgresql.org/docs/current/errcodes-appendix.html')
        res.sendStatus(500)
    }
}

module.exports.getOne = async (req, res) => {
    const { userId, id } = req.params
    try {
        const category = await db.query(db.categories.getOne, [userId, id])
        res.json(category.rows)
    } catch (e) {
        console.log('error while getOne categories: ', e.code)
        console.log('look for the error here: https://www.postgresql.org/docs/current/errcodes-appendix.html')
        res.sendStatus(500)
    }
}

module.exports.create = async (req, res) => {
    const newData = req.body
    const { userId } = req.params
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
        console.log('look for the error here: https://www.postgresql.org/docs/current/errcodes-appendix.html')
        res.sendStatus(500)
    }
}

module.exports.editOne = async (req, res) => {
    const { userId, id } = req.params
    try {
        const categoryRes = await db.query(db.categories.getOne, [userId, id])
        const category = categoryRes.rows[0]
        if (category) {
            category.name = req.body.name ? req.body.name : category.name
            category.color = req.body.color ? req.body.color : category.color
            await db.query(db.categories.updateOne, [
                id,
                category.name,
                category.color
            ])
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch (e) {
        console.log('error while editOne categories: ', e.code)
        console.log('look for the error here: https://www.postgresql.org/docs/current/errcodes-appendix.html')
        res.sendStatus(500)
    }
}

module.exports.deleteOne = async (req, res) => {
    const { userId, id } = req.params
    try {
        await db.query(db.categories.deleteOne, [userId, id])
        res.sendStatus(200)
    } catch (e) {
        console.log('error while deleteOne categories: ', e.code)
        console.log('look for the error here: https://www.postgresql.org/docs/current/errcodes-appendix.html')
        res.sendStatus(500)
    }
}