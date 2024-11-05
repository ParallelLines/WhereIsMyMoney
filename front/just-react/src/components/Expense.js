import { useState } from 'react'
import ColorMarker from './ColorMarker'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import ExpensesListForm from './ExpensesListForm'
import { dateString, dateTimeString } from '../utils/date'
import { useExpensesDispatch } from '../utils/ExpensesContext'
import useExpenseApi from '../utils/useExpenseApi'

export default function Expense({ expenseData }) {
    const expensesDispatch = useExpensesDispatch()
    const { edit, remove } = useExpenseApi()
    const [editMode, setEditMode] = useState(false)
    const date = new Date(expenseData.date)

    const handleEdit = async (data) => {
        setEditMode(false)
        await edit(data)
            .then(() => expensesDispatch({
                type: 'update',
                expense: data
            }))
    }

    const handleDelete = async () => {
        await remove(expenseData.id)
            .then(() => expensesDispatch({
                type: 'delete',
                expense: { id: expenseData.id }
            }))
    }

    return (
        <>
            {!editMode &&
                <div className="expense">
                    <span className='expense-name' title={expenseData.name}>{expenseData.name}</span>
                    <span className='expense-sum'>{expenseData.sum}</span>
                    <span className='expense-currency'>{expenseData.symbol}</span>
                    <span className='expense-date' title={dateTimeString(date)}>{dateString(date)}</span>
                    <ColorMarker name={expenseData.category_name} color={expenseData.color} />
                    <span className='expense-invisible_btns'>
                        <button
                            className="icon-btn invisible-btn"
                            title="Edit"
                            onClick={() => setEditMode(true)}>
                            <IconEdit />
                        </button>
                        <button
                            className="icon-btn invisible-btn"
                            title="Delete"
                            onClick={handleDelete}>
                            <IconDelete />
                        </button>
                    </span>
                </div>}
            {editMode && <ExpensesListForm
                expenseData={expenseData}
                onSubmit={handleEdit}
                onCancel={() => setEditMode(false)}
            />}
        </>
    )
}