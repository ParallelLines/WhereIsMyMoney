import { useState } from 'react'
import { dateString } from '../utils/date'
import { useEditRegular, useDeleteRegular } from '../utils/reactQueryHooks'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import ConfirmationPopup from './ConfirmationPopup'
import RegularExpenseForm from './RegularExpenseForm'

export default function RegularExpense({ data, onCheckboxChange, isChecked }) {
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)

    const edit = useEditRegular()
    const del = useDeleteRegular()

    const handleEdit = () => {
        setEditMode(false)
        edit.mutate()
    }

    return (
        <>
            {!editMode &&
                <div className='list-item regular-expense'>
                    {deleteMode && <ConfirmationPopup
                        message={`Are you sure you want to delete ${data.name}?`}
                        onConfirm={() => del.mutate(data.id)}
                        onCancel={() => setDeleteMode(false)}
                    />}
                    <div className='checkbox-column'>
                        <input
                            type='checkbox'
                            id={data.id}
                            onChange={onCheckboxChange}
                            checked={isChecked}>
                        </input>
                    </div>
                    <span className='regular-expense-name'>{data.name}</span>
                    <span className='regular-expense-sum'>{data.sum}</span>
                    <span className='regular-expense-currency' title={data.currency}>{data.symbol}</span>
                    <span className='regular-expense-date'>next: {dateString(data.next_date)}</span>
                    <span className='invisible-ctrls'>
                        <button
                            className='icon-btn invisible-ctrl'
                            title='Edit'
                            onClick={() => setEditMode(true)}>
                            <IconEdit />
                        </button>
                        <button
                            className='icon-btn invisible-ctrl'
                            title='Delete'
                            onClick={() => setDeleteMode(true)}>
                            <IconDelete />
                        </button>
                    </span>
                </div>}
            {editMode && <RegularExpenseForm
                regularData={data}
                onCancel={() => setEditMode(false)}
                onSubmit={handleEdit}
            />}
        </>
    )
}