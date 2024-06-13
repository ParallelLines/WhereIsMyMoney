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

const users = {
    getOne: 'SELECT * FROM users WHERE id = $1',
    createOne: 'INSERT INTO users (name, password) VALUES ($1, $2)',
    updateOne: 'UPDATE users SET name = $2, password = $3 WHERE id = $1',
    deleteOne: 'DELETE FROM users WHERE id = $1'
}

const currencies = {
    getAll: 'SELECT * FROM currencies',
    getOne: 'SELECT * FROM currencies WHERE name = $1',
    createOne: 'INSERT INTO currencies (name, symbol) VALUES ($1, $2)',
    updateOne: 'UPDATE currencies SET name = $2, symbol = $3 WHERE name = $1',
    deleteOne: 'DELETE FROM currencies WHERE name = $1'
}

const expenses = {
    getAll: 'SELECT e.id, e.user_id, e.category_id, e.name, ca.name AS category_name, ca.color, e.sum, e.currency, cu.symbol, e.date, e.regular_id, e.regular_name FROM expenses e JOIN categories ca ON e.category_id = ca.id JOIN currencies cu ON e.currency = cu.name WHERE e.user_id = $1 ORDER BY e.date DESC',
    getOne: 'SELECT e.id, e.user_id, e.category_id, e.name, ca.name AS category_name, ca.color, e.sum, e.currency, cu.symbol, e.date, e.regular_id, e.regular_name FROM expenses e JOIN categories ca ON e.category_id = ca.id JOIN currencies cu ON e.currency = cu.name WHERE e.id = $1',
    createOne: 'INSERT INTO expenses (user_id, category_id, name, sum, inUSD, currency, regular_id, regular_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    updateOne: 'UPDATE expenses SET category_id = $2, name = $3, sum = $4, inUSD = $5, currency = $6, date = $7 WHERE id = $1',
    deleteOne: 'DELETE FROM expenses WHERE id = $1'
}

const categories = {
    getAll: 'WITH popcat AS (SELECT category_id, count(*) FROM expenses WHERE user_id = $1 GROUP BY category_id) SELECT cat.id, cat.user_id, cat.name, cat.color, popcat.count FROM categories cat JOIN popcat ON popcat.category_id = cat.id',
    getOne: 'SELECT * FROM categories WHERE id = $1',
    createOne: 'INSERT INTO categories (user_id, name, color) VALUES ($1, $2, $3)',
    updateOne: 'UPDATE categories SET name = $2, color = $3 WHERE id = $1',
    deleteOne: 'DELETE FROM categories WHERE id = $1',
    getOneByUser: 'SELECT * FROM categories WHERE id = $1 AND user_id = $2'
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    users: users,
    currencies: currencies,
    expenses: expenses,
    categories: categories
}