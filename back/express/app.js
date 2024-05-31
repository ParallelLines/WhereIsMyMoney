if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')
const currenciesRoutes = require('./routes/currencies')
const categoriesRoutes = require('./routes/categories')
const expensesRoutes = require('./routes/expenses')

app.use(express.urlencoded({ extended: true }))
app.use('/users', usersRoutes)
app.use('/currencies', currenciesRoutes)
app.use('/categories', categoriesRoutes)
app.use('/expenses', expensesRoutes)

app.listen(3000, () => {
    console.log('listening on localhost:3000')
}) 