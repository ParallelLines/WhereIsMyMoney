import db from '../db.js'

export async function getCategoriesByExpenseName(req, res) {
    const { userId } = req
    const { name } = req.params
    const categories = await db.query(db.suggestions.getCategoriesByExpenseName, [userId, name])
    res.json(categories.rows)
}

export async function getExpenseNames(req, res) {
    const { userId } = req
    const { name } = req.params
    const categories = await db.query(db.suggestions.getExpenseNames, [userId, name])
    res.json(categories.rows)
}

export async function updateSuggestionsTable() {
    await db.query(db.suggestions.updateCategoryByExpenseName)
}