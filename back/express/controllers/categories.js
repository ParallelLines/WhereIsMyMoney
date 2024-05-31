const db = require('../db')

module.exports.getAll = async (req, res) => {
    const categories = await db.query(db.categories.getAll)
    res.json(categories.rows)
}

module.exports.getOne = async (req, res) => {
    const { id } = req.params
    const category = await db.query(db.categories.getOne, [id])
    res.json(category.rows)
}

module.exports.create = async (req, res) => {
    const newData = req.body
    const result = await db.query(db.categories.createOne, [
        newData.user_id,
        newData.name,
        newData.color
    ])
    res.send('done')
}

module.exports.editOne = async (req, res) => {
    const { id } = req.params
    const categoryRes = await db.query(db.categories.getOne, [id])
    const category = categoryRes.rows[0]
    if (category) {
        category.name = req.body.name ? req.body.name : category.name
        category.color = req.body.color ? req.body.color : category.color
        const result = await db.query(db.categories.updateOne, [
            id,
            category.name,
            category.color
        ])
        const editedCategory = await db.query(db.categories.getOne, [id])
        res.json(editedCategory.rows)
    } else {
        res.send('no such record')
    }
}

module.exports.deleteOne = async (req, res) => {
    const { id } = req.params
    const result = await db.query(db.categories.deleteOne, [id])
    res.send('done')
}