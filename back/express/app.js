if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expensesRoutes = require('./routes/expenses')

app.use(express.urlencoded({ extended: true }))
app.use('/expenses', expensesRoutes)

app.listen(3000, () => {
    console.log('listening on localhost:3000')
}) 