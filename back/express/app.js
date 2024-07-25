if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const PORT = process.env.PORT ?? 3000
const express = require('express')
const app = express()
const usersRoutes = require('./routes/users')
const currenciesRoutes = require('./routes/currencies')
const categoriesRoutes = require('./routes/categories')
const expensesRoutes = require('./routes/expenses')
const loginRoutes = require('./routes/login')
const signupRoutes = require('./routes/signup')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/users', usersRoutes)
app.use('/currencies', currenciesRoutes)
app.use('/categories', categoriesRoutes)
app.use('/expenses', expensesRoutes)
app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)

app.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`)
}) 