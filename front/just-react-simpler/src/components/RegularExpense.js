import { useState } from 'react'
import { dateString } from '../utils/date'
import { useDeleteRegular } from '../utils/reactQueryHooks'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import ConfirmationPopup from './ConfirmationPopup'
import RegularExpenseForm from './RegularExpenseForm'
import ColorMarker from './ColorMarker'

export default function RegularExpense({ data, onCheckboxChange, isChecked }) {
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)

    const del = useDeleteRegular()

    return (
        <>
            {!editMode &&
                <div className={`list-item expense ${data.next_date ? '' : ' finished'}`}>
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
                    <label htmlFor={data.id} className='expense'>
                        <span className='regular-expense-name'>{data.name}</span>
                        <span className='expense-sum'>{data.sum}</span>
                        <span className='expense-currency' title={data.currency}>{data.symbol}</span>
                        <span className='regular-expense-date'>next: {data.next_date ? dateString(data.next_date) : 'never'}</span>
                        <ColorMarker name={data.category_name} color={data.color} />
                    </label>
                    <div className='invisible-ctrls'>
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
                    </div>
                </div>}
            {editMode && <RegularExpenseForm
                regularData={data}
                onCancel={() => setEditMode(false)}
                onSubmit={() => setEditMode(false)}
            />}
        </>
    )
}