if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

const expenses = {
    getAll: 'SELECT * FROM expenses',
    getOne: 'SELECT * FROM expenses WHERE id = $1',
    createOne: 'INSERT INTO expenses (user_id, category_id, name, sum, inUSD, currency, regular_id, regular_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    updateOne: 'UPDATE expenses SET category_id = $2, name = $3, sum = $4, inUSD = $5, currency = $6, date = $7 WHERE id = $1',
    deleteOne: 'DELETE FROM expenses WHERE id = $1'
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    expenses: expenses
}