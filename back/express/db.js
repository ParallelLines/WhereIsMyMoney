if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const { readSql } = require('./utils/sqlReader')
const getCategoriesRecursive = readSql('./sql/categoriesGetAllRecursive.sql')
const getPopularCategories = readSql('./sql/categoriesGetPopular.sql')
const getExpenses = readSql('./sql/expensesGetAll.sql')
const getOneExpense = readSql('./sql/expensesGetOne.sql')

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
    getOneByName: 'SELECT * FROM users WHERE name = $1',
    getIdByName: 'SELECT id FROM users WHERE name = $1',
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
    getAll: getExpenses,
    getOne: getOneExpense,
    createOne: 'INSERT INTO expenses (user_id, category_id, name, sum, inUSD, currency, regular_id, regular_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    updateOne: 'UPDATE expenses SET category_id = $3, name = $4, sum = $5, inUSD = $6, currency = $7, date = $8 WHERE user_id = $1 AND id = $2',
    deleteOne: 'DELETE FROM expenses WHERE user_id = $1 AND id = $2'
}

const categories = {
    getAll: 'SELECT * FROM categories WHERE user_id = $1',
    getAllRecursive: getCategoriesRecursive,
    getPopular: getPopularCategories,
    getOne: 'SELECT * FROM categories WHERE user_id = $1 AND id = $2',
    createOne: 'INSERT INTO categories (user_id, name, parent_id, color) VALUES ($1, $2, $3, $4) RETURNING id',
    updateOne: 'UPDATE categories SET name = $2, color = $3 WHERE id = $1',
    deleteOne: 'DELETE FROM categories WHERE user_id = $1 AND id = $2'
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    users: users,
    currencies: currencies,
    expenses: expenses,
    categories: categories
}