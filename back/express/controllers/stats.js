import db from '../db.js'

export async function getPieStats(req, res) {
    const { userId } = req
    const stats = await db.query(db.stats.getByCategories, [userId])
    res.json(stats.rows)
}