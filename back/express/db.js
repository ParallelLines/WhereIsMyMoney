// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }
const { readSql } = require('./utils/sqlReader')
const categoriesGetAllRecursive = readSql('./sql/categoriesGetAllRecursive.sql')
const categoriesGetPopular = readSql('./sql/categoriesGetPopular.sql')
const expensesGetAll = readSql('./sql/expensesGetAll.sql')
const expensesGetAllByCategory = readSql('./sql/expensesGetAllByCategory.sql')
const expensesGetOne = readSql('./sql/expensesGetOne.sql')
const expensesNamesByPrefix = readSql('./sql/expensesNamesByPrefix.sql')
const regularsGetAll = readSql('./sql/regularsGetAll.sql')
const regularsGetAllByCategory = readSql('./sql/regularsGetAllByCategory.sql')
const regularsGetOne = readSql('./sql/regularsGetOne.sql')
const regularsGetPending = readSql('./sql/regularsGetPending.sql')
const regularsCreateOne = readSql('./sql/regularsCreateOne.sql')
const regularsUpdateOne = readSql('./sql/regularsUpdateOne.sql')
const regularsUpdateNextDate = readSql('./sql/regularsUpdateNextDate.sql')
const regularsExecutions = readSql('./sql/regularsExecutions.sql')
const currenciesGetAll = readSql('./sql/currenciesGetAll.sql')

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
    getAllOrdered: currenciesGetAll,
    getAll: 'SELECT * FROM currencies',
    getOne: 'SELECT * FROM currencies WHERE name = $1',
    createOne: 'INSERT INTO currencies (name, symbol) VALUES ($1, $2)',
    updateOne: 'UPDATE currencies SET name = $2, symbol = $3 WHERE name = $1',
    deleteOne: 'DELETE FROM currencies WHERE name = $1'
}

const expenses = {
    getAll: expensesGetAll,
    getAllByCategory: expensesGetAllByCategory,
    getNamesByPrefix: expensesNamesByPrefix,
    getOne: expensesGetOne,
    createOne: 'INSERT INTO expenses (user_id, category_id, name, sum, inUSD, currency, regular_id, regular_name, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
    updateOne: 'UPDATE expenses SET category_id = $3, name = $4, sum = $5, inUSD = $6, currency = $7, date = $8 WHERE user_id = $1 AND id = $2',
    deleteOne: 'DELETE FROM expenses WHERE user_id = $1 AND id = $2',
    deleteMany: 'DELETE FROM expenses WHERE user_id = $1 AND id IN '
}

const regulars = {
    getAll: regularsGetAll,
    getAllByCategory: regularsGetAllByCategory,
    getOne: regularsGetOne,
    getPending: regularsGetPending,
    createOne: regularsCreateOne,
    updateOne: regularsUpdateOne,
    updateNextDate: regularsUpdateNextDate,
    deleteOne: 'DELETE FROM regulars WHERE user_id = $1 AND id = $2',
    deleteMany: 'DELETE FROM regulars WHERE user_id = $1 AND id IN ',
    getExecutionTimes: regularsExecutions
}

const categories = {
    getAll: 'SELECT * FROM categories WHERE user_id = $1',
    getAllRecursive: categoriesGetAllRecursive,
    getPopular: categoriesGetPopular,
    getOne: 'SELECT * FROM categories WHERE user_id = $1 AND id = $2',
    createOne: 'INSERT INTO categories (user_id, name, parent_id, color) VALUES ($1, $2, $3, $4) RETURNING id',
    updateOne: 'UPDATE categories SET name = $2, color = $3 WHERE id = $1',
    deleteOne: 'DELETE FROM categories WHERE user_id = $1 AND id = $2',
    deleteMany: 'DELETE FROM categories WHERE user_id = $1 AND id IN '
}

const rates = {
    checkExistenceByDate: 'SELECT EXISTS (SELECT 1 FROM rates WHERE date = $1)',
    getRateByDateAndCurrency: 'SELECT rate FROM rates WHERE date = $1 AND from_currency = $2'
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    users: users,
    currencies: currencies,
    expenses: expenses,
    regulars: regulars,
    categories: categories,
    rates: rates
}