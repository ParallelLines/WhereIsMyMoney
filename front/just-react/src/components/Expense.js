import { useState } from 'react'
import ColorMarker from './ColorMarker'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import ExpensesListForm from './ExpensesListForm'
import { dateString, dateTimeString } from '../utils/date'

export default function Expense({ expenseData, onEdit, onDelete }) {
    const [editMode, setEditMode] = useState(false)
    const date = new Date(expenseData.date)

    const handleEdit = (data) => {
        setEditMode(false)
        onEdit(data)
    }

    const handleDelete = () => {
        onDelete(expenseData.id)
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
                </div>}
            {editMode && <ExpensesListForm
                expenseData={expenseData}
                onSubmit={handleEdit}
                onCancel={() => setEditMode(false)}
            />}
        </>
    )
}