import RegularExpense from './RegularExpense'
import { useState } from 'react'
import { useDeleteRegulars, useFetchRegulars } from '../utils/reactQueryHooks'
import ConfirmationPopup from './ConfirmationPopup'
import RegularExpenseForm from './RegularExpenseForm'

export default function RegularExpensesList() {
    const [createMode, setCreateMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [regularsToDelete, setRegularsToDelete] = useState([])

    const query = useFetchRegulars()
    const deleteBulk = useDeleteRegulars()

    const handleCheckboxChange = (e) => {
        const regularId = e.target.id
        const index = regularsToDelete.indexOf(regularId)
        if (index >= 0) {
            setRegularsToDelete(regularsToDelete.toSpliced(index, 1))
        } else {
            setRegularsToDelete([...regularsToDelete, regularId])
        }
    }

    return (
        <div className='regular-expenses-list'>
            {deleteMode && <ConfirmationPopup
                message={`Are you sure you want to delete ${regularsToDelete.length} regular expense record${regularsToDelete.length === 1 ? '' : 's'}?`}
                onConfirm={() => {
                    deleteBulk.mutate(regularsToDelete)
                    setRegularsToDelete([])
                    setDeleteMode(false)
                }}
                onCancel={() => setDeleteMode(false)}
            />}
            <div className='list-ctrls'>
                <button onClick={() => setCreateMode(true)}>+</button>
                {regularsToDelete.length > 0 && <button onClick={() => setDeleteMode(true)}>Delete selected</button>}
                {regularsToDelete.length > 0 && <button onClick={() => setRegularsToDelete([])}>Cancel</button>}
            </div>
            <div className={`list-column ${regularsToDelete.length > 0 ? 'visible-checkbox' : ''}`}>
                {createMode && <RegularExpenseForm onCancel={() => setCreateMode(false)} onSubmit={() => setCreateMode(false)} />}
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.map(regular => {
                    return <RegularExpense
                        data={regular}
                        key={regular.id}
                        isChecked={regularsToDelete.indexOf(regular.id) > -1}
                        onCheckboxChange={handleCheckboxChange}
                    />
                })}
            </div>
        </div>
    )
}