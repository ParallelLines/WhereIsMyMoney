import { dateString, dateTimeString } from "../utils/date"
import ColorMarker from "./ColorMarker"
import IconEdit from "./icons/IconEdit"
import IconDelete from "./icons/IconDelete"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import ExpensesForm from "./ExpensesForm"
import { deleteExpense, editExpense } from "../apiService/expenses"
import ConfirmationPopup from "./ConfirmationPopup"

export default function Expense({ data, onCheckboxChange, isChecked }) {
    const queryClient = useQueryClient()
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const date = new Date(data.date)

    const edit = useMutation({
        mutationFn: editExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currencies'] })
        }
    })

    const del = useMutation({
        mutationFn: deleteExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] })
    })

    const handleEdit = () => {
        setEditMode(false)
        edit.mutate()
    }

    return (
        <>
            {!editMode &&
                <div className="expense">
                    {deleteMode && <ConfirmationPopup
                        message={`Are you sure you want to delete ${data.name}?`}
                        onConfirm={() => del.mutate(data.id)}
                        onCancel={() => setDeleteMode(false)}
                    />}
                    <div className="checkbox-column">
                        <input
                            type="checkbox"
                            id={data.id}
                            onChange={onCheckboxChange}
                            checked={isChecked}>
                        </input>
                    </div>
                    <label htmlFor={data.id} className="expense">
                        <span className="expense-name" title={data.name}>{data.name}</span>
                        <span className="expense-sum">{data.sum}</span>
                        <span className="expense-currency">{data.symbol}</span>
                        <span className="expense-date" title={dateTimeString(date)}>{dateString(date)}</span>
                        <ColorMarker name={data.category_name} color={data.color} />
                        <span className="invisible-ctrls">
                            <button
                                className="icon-btn invisible-ctrl"
                                title="Edit"
                                onClick={() => setEditMode(true)}>
                                <IconEdit />
                            </button>
                            <button
                                className="icon-btn invisible-ctrl"
                                title="Delete"
                                onClick={() => setDeleteMode(true)}>
                                <IconDelete />
                            </button>
                        </span>
                    </label>
                </div>
            }
            {editMode && <ExpensesForm
                expenseData={data}
                onCancel={() => setEditMode(false)}
                onSubmit={handleEdit} />
            }
        </>
    )
}