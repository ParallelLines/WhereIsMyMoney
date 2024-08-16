import { useState } from 'react'
import ColorMarker from './ColorMarker'
import IconEdit from './IconEdit'
import IconDelete from './IconDelete'
import ExpensesListForm from './ExpensesListForm'

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
                <div className="expense text-standart">
                    <span className='expense-name'>{expenseData.name}</span>
                    <span className='expense-sum'>{expenseData.symbol + expenseData.sum}</span>
                    <span className='expense-date'>{date.toDateString()}</span>
                    <ColorMarker name={expenseData.category_name} color={expenseData.color} />
                    <button className="icon-btn invisible-btn" onClick={() => setEditMode(true)}><IconEdit /></button>
                    <button className="icon-btn invisible-btn" onClick={handleDelete}><IconDelete /></button>
                </div>}
            {editMode && <ExpensesListForm
                expenseData={expenseData}
                onSubmit={handleEdit}
                onCancel={() => setEditMode(false)}
            />}
        </>
    )
}