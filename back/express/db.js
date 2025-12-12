import dotenv from 'dotenv'
import postgres from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const { Pool } = postgres

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
function loadQueries() {
    const queries = {}
    const sqlDir = path.join(__dirname, 'sql')

    const files = fs.readdirSync(sqlDir).filter(f => f.endsWith('.sql'))

    files.forEach(file => {
        const name = file.replace('.sql', '') // expensesGetAll
        const entity = name.match(/^[a-z]+/)[0] // expenses
        const action = name.slice(entity.length) // expensesGetAll → GetAll
        const actionKey = action.charAt(0).toLowerCase() + action.slice(1) // GetAll → getAll

        if (!queries[entity]) queries[entity] = {}

        const filePath = path.join(sqlDir, file)
        queries[entity][actionKey] = fs.readFileSync(filePath, 'utf-8')
    })

    return queries
}

const queries = loadQueries()

export default {
    query: (text, params) => pool.query(text, params),
    ...queries
}