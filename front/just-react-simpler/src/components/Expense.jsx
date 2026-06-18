import { dateString, dateTimeString, isItToday } from '../utils/date'
import ColorMarker from './ColorMarker'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import { useState, useMemo } from 'react'
import ExpensesForm from './ExpensesForm'
import ConfirmationPopup from './ConfirmationPopup'
import { useDeleteExpense } from '../utils/reactQueryHooks'
import { useScreenSize } from '../utils/hooks'
import ExpenseView from './ExpenseView'

export default function Expense({ data, onCheckboxChange, isChecked }) {
    const screenSize = useScreenSize()
    const isSmallScreen = screenSize === 'small'
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [viewMode, setViewMode] = useState(false)
    const date = new Date(data.date)
    const isToday = useMemo(() => isItToday(data.date), [data.date])

    const del = useDeleteExpense()

    return (
        <>
            {!editMode &&
                <div className='list-item expense'>
                    {viewMode && <ExpenseView
                        data={data}
                        onClose={() => setViewMode(false)}
                        onEdit={() => {
                            setViewMode(false)
                            setEditMode(true)
                        }}
                        onDelete={() => {
                            setViewMode(false)
                            setDeleteMode(true)
                        }}
                    />}
                    {deleteMode && <ConfirmationPopup
                        message={`Are you sure you want to delete ${data.name}?`}
                        onConfirm={() => del.mutate(data.id)}
                        onCancel={() => setDeleteMode(false)}
                    />}
                    {!isSmallScreen &&
                        <div className='checkbox-column'>
                            <input
                                type='checkbox'
                                id={data.id}
                                onChange={onCheckboxChange}
                                checked={isChecked}>
                            </input>
                        </div>
                    }
                    <label htmlFor={data.id} className='expense' onClick={() => { if (isSmallScreen) setViewMode(true) }}>
                        <span className='expense-name' title={data.name}>{data.name}</span>
                        <span className='expense-sum'>{data.sum}</span>
                        <span className='expense-currency'>{data.symbol}</span>
                        <span className={`expense-date ${isToday ? 'todays-expence' : ''}`} title={dateTimeString(date)}>{dateString(date)}</span>
                        <ColorMarker name={data.category_name} color={data.color} />
                    </label>
                    {!isSmallScreen &&
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
                    }
                </div>
            }
            {editMode && <ExpensesForm
                expenseData={data}
                onCancel={() => setEditMode(false)}
                onSubmit={() => setEditMode(false)}
            />}
        </>
    )
}