import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import Expense from './Expense'
import SkeletonExpensesList from './SkeletonExpensesList'
import IconAdd from './IconAdd'

const ENDPOINT = '/expenses'

/** 
 * expense structure:
 * { id, user_id, category_id, name, sum, inusd, currency, date, regular_id, regular_name, 
 * category_name, color, symbol }
*/

export default function ExpensesList() {
    const [loading, setLoading] = useState(true)
    const [expenses, setExpenses] = useState([])

    const insertNewExpense = (expenseData) => {
        expenses.unshift(expenseData)
        setExpenses([...expenses])
    }

    const updateEditedExpense = (expenseData) => {
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id === expenseData.id) {
                Object.assign(expenses[i], expenseData)
                setExpenses([...expenses])
                break
            }
        }
    }

    const removeDeletedExpense = (id) => {
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id === id) {
                expenses.splice(i, 1)
                setExpenses([...expenses])
                break
            }
        }
    }

    const getExpenses = async () => {
        axiosInstance
            .get(ENDPOINT)
            .then(response => {
                if (response) {
                    setExpenses(response.data)
                    setLoading(false)
                }
            })
    }

    useEffect(() => {
        getExpenses()
    }, [])
    return (
        <div className="expenses-list">
            <h2>Expenses</h2>
            <button className="icon-btn"><IconAdd /></button>
            {loading && <SkeletonExpensesList />}
            {expenses.map(expense => <Expense data={expense} key={expense.id} />)}
        </div>
    )
}