if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const db = require('./db')
const app = express()

app.get('/', async (req, res) => {
    try {
        const currencies = await db.query('select * from currencies')
        res.json(currencies.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

app.listen(3000, () => {
    console.log('listening on localhost:3000')
}) 