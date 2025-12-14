import db from '../db.js'

export async function getCategoriesByExpenseName(req, res) {
    const { userId } = req
    const { name } = req.params
    const categories = await db.query(db.suggestions.getCategoriesByExpenseName, [userId, name])
    res.json(categories.rows)
}