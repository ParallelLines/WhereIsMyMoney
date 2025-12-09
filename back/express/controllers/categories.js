import db from '../db.js'

export async function getAll(req, res) {
    const { userId } = req
    const categories = await db.query(db.categories.getAllRecursive, [userId])
    res.json(categories.rows)
}

export async function getOne(req, res) {
    const { userId } = req
    const { id } = req.params
    const category = await db.query(db.categories.getOne, [userId, id])
    res.json(category.rows)
}

export async function create(req, res) {
    const newData = req.body
    const { userId } = req
    const result = await db.query(db.categories.createOne, [
        userId,
        newData.name,
        newData.parent_id,
        newData.color
    ])
    res.json(result.rows)
}

export async function editOne(req, res) {
    const { userId } = req
    const { id } = req.params
    const { name, color } = req.body
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
}

export async function deleteOne(req, res) {
    const { userId } = req
    const { id } = req.params
    if (!id) {
        throw new HttpError(400, 'empty request')
    }
    await db.query(db.categories.deleteOne, [userId, id])
    res.sendStatus(200)
}

export async function deleteMany(req, res) {
    const { userId } = req
    const { ids } = req.body
    if (!ids || !ids.length) {
        throw new HttpError(400, 'empty request')
    }
    const offset = 2
    const placeholders = ids.map((val, i) => '$' + (i + offset)).join(', ')
    await db.query(db.categories.deleteMany + '(' + placeholders + ')', [userId, ...ids])
    res.sendStatus(200)
}

export async function isCategoryValid(categoryId, userId) {
    try {
        const category = await db.query(db.categories.getOne, [userId, categoryId])
        return category.rows.length === 1
    } catch (e) {
        console.error(e)
        return null
    }
}