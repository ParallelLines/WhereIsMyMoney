import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
import './scheduler/regularExpensesScheduler.js'
import './scheduler/suggestionsUpdateScheduler.js'
import express from 'express'
import cors from 'cors'
// import usersRoutes from './routes/users.js'
import currenciesRoutes from './routes/currencies.js'
import categoriesRoutes from './routes/categories.js'
import expensesRoutes from './routes/expenses.js'
import regularsRoutes from './routes/regulars.js'
import loginRoutes from './routes/login.js'
// import signupRoutes from './routes/signup.js'
import suggestionsRoutes from './routes/suggestions.js'
import statsRoutes from './routes/stats.js'

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(express.json())
app.use(cors())
// app.use('/users', usersRoutes)
app.use('/currencies', currenciesRoutes)
app.use('/categories', categoriesRoutes)
app.use('/expenses', expensesRoutes)
app.use('/regulars', regularsRoutes)
app.use('/suggestions', suggestionsRoutes)
app.use('/stats', statsRoutes)
// app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)

app.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`)
}) 