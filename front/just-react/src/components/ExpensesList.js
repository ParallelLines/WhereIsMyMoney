import { useEffect, useState } from 'react'
import Expense from './Expense'
import SkeletonExpensesList from './skeleton/SkeletonExpensesList'
import IconAdd from './icons/IconAdd'
import ExpensesListForm from './ExpensesListForm'
import useExpenseApi from '../utils/useExpenseApi'
import { useExpenses, useExpensesDispatch } from '../utils/ExpensesContext'

/** 
 * expense structure:
 * { id, user_id, category_id, name, sum, inusd, currency, date, regular_id, regular_name, 
 * category_name, color, symbol }
*/

export default function ExpensesList() {
    const expenses = useExpenses()
    const expensesDispatch = useExpensesDispatch()
    const { getAll, create, loading, error } = useExpenseApi()
    const [createMode, setCreateMode] = useState(false)

    const handleCreate = async (data) => {
        await create(data)
            .then(response => {
                data.id = response.data[0].id
                expensesDispatch({
                    type: 'insert',
                    expense: data
                })
                setCreateMode(false)
            })
    }

    useEffect(() => {
        getAll()
            .then(response => expensesDispatch({
                type: 'insert_all',
                expenses: response.data
            }))
    }, [])

    return (
        <div className="expenses-list list-column">
            <button
                className="btn-centered"
                onClick={() => setCreateMode(true)}
            >
                <IconAdd />
            </button>
            {createMode && <ExpensesListForm onSubmit={handleCreate} onCancel={() => setCreateMode(false)} />}
            <div className='list-container'>
                {loading && <SkeletonExpensesList />}
                {expenses.map(expense =>
                    <Expense
                        expenseData={expense}
                        key={expense.id}
                    />)}
            </div>
        </div>
    )
}