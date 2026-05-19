import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import Expense from './Expense'
import SkeletonExpensesList from './SkeletonExpensesList'
import IconAdd from './IconAdd'
import ExpensesListForm from './ExpensesListForm'

const ENDPOINT = '/expenses'

/** 
 * regular expense structure: ??
 * { id, user_id, category_id, name, sum, inusd, currency, date, regular_id, regular_name, 
 * category_name, color, symbol }
*/

export default function RegularExpensesList() {
    const [loading, setLoading] = useState(true)
    const [expenses, setExpenses] = useState([])
    const [createMode, setCreateMode] = useState(false)

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
            .catch(e => {
                console.log('Error trying to request expenses: ', e)
            })
    }

    const createExpense = async (expenseData) => {
        await axiosInstance
            .post(ENDPOINT, {
                name: expenseData.name,
                sum: expenseData.sum,
                currency: expenseData.currency,
                category_id: expenseData.category_id,
                date: expenseData.date
            })
            .then(response => {
                if (response) {
                    expenseData.id = response.data[0].id
                    insertNewExpense(expenseData)
                    setCreateMode(false)
                }
            })
            .catch(e => {
                console.log('Error trying to create an expense: ', e)
                // setError('couldn\'t create an expense :(')
            })
    }

    const editExpense = async (expenseData) => {
        await axiosInstance
            .put(ENDPOINT + '/' + expenseData.id, {
                name: expenseData.name,
                sum: expenseData.sum,
                currency: expenseData.currency,
                category_id: expenseData.category_id,
                date: expenseData.date
            })
            .then(response => {
                if (response) {
                    updateEditedExpense(expenseData)
                }
            })
            .catch(e => {
                console.log('Error trying to edit an expense: ', e)
                // setError('couldn\'t edit an expense :(')
            })
    }

    const deleteExpense = async (id) => {
        await axiosInstance
            .delete(ENDPOINT + '/' + id)
            .then(response => {
                if (response) {
                    removeDeletedExpense(id)
                }
            })
            .catch(e => {
                console.log('Error trying to delete an expense: ', e)
                // setError('couldn\'t delete an expense :(')
            })
    }

    useEffect(() => {
        getExpenses()
    }, [])

    return (
        <div className="expenses-list">
            <button className="icon-btn" onClick={() => setCreateMode(true)}><IconAdd /></button>
            {loading && <SkeletonExpensesList />}
            {createMode && <ExpensesListForm onSubmit={createExpense} onCancel={() => setCreateMode(false)} />}
            <div className='list-container'>
                {expenses.map(expense =>
                    <Expense
                        expenseData={expense}
                        key={expense.id}
                        onEdit={editExpense}
                        onDelete={deleteExpense}
                    />)}
            </div>
        </div>
    )
}