import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { formatDateForInput } from '../utils/date'
import VanishingBlock from './VanishingBlock'
import { useCategories } from '../utils/CategoriesContext'

const CURRENCIES_ENDPOINT = '/currencies'

export default function ExpensesListForm({ expenseData, onSubmit, onCancel }) {
    const categories = useCategories()
    const [expense, setExpense] = useState(expenseData ? expenseData : {
        name: '',
        sum: '',
        category_id: categories[0].id,
        category_name: '',
        color: '',
        date: new Date()
    })

    const [loading, setLoading] = useState(false)

    const [currenciesLoading, setCurrenciesLoading] = useState(true)
    const [currencies, setCurrencies] = useState([])

    const date = formatDateForInput(expenseData ? new Date(expenseData.date) : new Date(expense.date))

    const handleChange = (e) => {
        setExpense(currExpense => {
            return {
                ...currExpense,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const cat = categories.filter(c => c.id === expense.category_id)[0]
        const curr = currencies.filter(c => c.name === expense.currency)[0]
        expense.sum = expense.sum.replace(',', '.')
        if (Number.isInteger(parseFloat(expense.sum))) {
            expense.sum = parseFloat(expense.sum) + '.00'
        }
        await onSubmit({
            ...expense,
            'symbol': curr.symbol,
            'category_name': cat.name,
            'color': cat.color
        })
    }

    const getCurrencies = async () => {
        await axiosInstance
            .get(CURRENCIES_ENDPOINT)
            .then((response) => {
                if (response) {
                    setCurrencies(response.data)
                    setCurrenciesLoading(false)
                    if (!expenseData) {
                        setExpense(currExpense => {
                            return {
                                ...currExpense,
                                'currency': response.data[0].name
                            }
                        })
                    }
                }
            })
            .catch(e => {
                console.log('Error trying to request currencies: ', e)
            })
    }

    useEffect(() => {
        getCurrencies()
    }, [])

    return (
        <VanishingBlock containerClassName="expenses-form-container" onClose={onCancel}>
            <form className="inline-form" onSubmit={handleSubmit}>
                <input name="name"
                    className="standart-input"
                    aria-label="name of expense"
                    value={expense.name}
                    placeholder="name"
                    onChange={handleChange}
                    autoFocus
                    required
                />
                <input name="sum"
                    className="short-input"
                    aria-label="expense amount"
                    value={expense.sum}
                    placeholder="45.99"
                    onChange={handleChange}
                    required
                />
                <select name="currency"
                    className="short-input"
                    aria-label="expense currency"
                    onChange={handleChange}
                    value={expense.currency}
                    required
                >
                    {currencies.map(currency =>
                        <option key={currency.name} value={currency.name}>
                            {currency.symbol} {currency.name}
                        </option>)}
                </select>
                <input name="date"
                    aria-label="expense date"
                    type="datetime-local"
                    onChange={handleChange}
                    defaultValue={date}
                />
                <select name="category_id"
                    aria-label="category of the expense"
                    onChange={handleChange}
                    defaultValue={expense.category_id}
                    required
                >
                    {categories.map(category =>
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>)}
                </select>
                <div className="btns">
                    <button type="submit" disabled={loading}>
                        {expenseData ? 'Save' : 'Create'}
                    </button>
                    <button onClick={onCancel} disabled={loading}>Cancel</button>
                </div>
            </form>

        </VanishingBlock>
    )
}