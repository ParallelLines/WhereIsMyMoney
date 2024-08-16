import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { formatDateForInput } from '../utils/date'
import VanishingBlock from './VanishingBlock'

const CURRENCIES_ENDPOINT = '/currencies'
const CATEGORIES_ENDPOINT = '/categories'

export default function ExpensesListForm({ expenseData, onSubmit, onCancel }) {
    const [expense, setExpense] = useState(expenseData ? expenseData : {
        name: '',
        sum: '',
        category_id: '',
        category_name: '',
        color: '',
        date: new Date()
    })

    const [currenciesLoading, setCurrenciesLoading] = useState(true)
    const [currencies, setCurrencies] = useState([])

    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [categories, setCategories] = useState([])

    const date = formatDateForInput(expenseData ? new Date(expenseData.date) : expense.date)


    const handleChange = (e) => {
        setExpense(currExpense => {
            return {
                ...currExpense,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const cat = categories.filter(c => c.id === expense.category_id)[0]
        const curr = currencies.filter(c => c.name === expense.currency)[0]
        expense.sum = expense.sum.replace(',', '.')
        if (Number.isInteger(parseFloat(expense.sum))) {
            expense.sum = expense.sum + '.00'
        }
        onSubmit({
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
                }
            })
            .catch(e => {
                console.log('Error trying to request currencies: ', e)
            })
    }

    const getCategories = async () => {
        await axiosInstance
            .get(CATEGORIES_ENDPOINT)
            .then((response) => {
                if (response) {
                    setCategories(response.data)
                    setCategoriesLoading(false)
                    if (!expenseData) {
                        setExpense(currExpense => {
                            return {
                                ...currExpense,
                                'category_id': response.data[0].id
                            }
                        })
                    }
                }
            })
            .catch(e => {
                console.log('Error trying to request categories: ', e)
            })
    }

    useEffect(() => {
        getCurrencies()
        getCategories()
    }, [])

    return (
        <VanishingBlock containerClassName="expenses-form-container" onClose={onCancel}>
            <form className="expenses-list-form" onSubmit={handleSubmit}>
                <input name="name"
                    aria-label="name of expense"
                    value={expense.name}
                    placeholder="name"
                    onChange={handleChange}
                    required
                />
                <input name="sum"
                    aria-label="expense amount"
                    value={expense.sum}
                    placeholder="amount spent"
                    onChange={handleChange}
                    required
                />
                <select name="currency"
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
                <input name="date"
                    aria-label="expense date"
                    type="datetime-local"
                    onChange={handleChange}
                    defaultValue={date}
                />
                <button type="submit">{expenseData ? 'Save' : 'Create'}</button>
                <button onClick={onCancel}>Cancel</button>
            </form>
        </VanishingBlock>
    )
}