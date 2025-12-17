import Expense from './Expense'
import { useRef, useState } from 'react'
import ExpensesForm from './ExpensesForm'
import ConfirmationPopup from './ConfirmationPopup'
import { useInfiniteScroll } from '../utils/hooks'
import { useDeleteExpenses, useFetchExpenses, usePrefetchExpenses } from '../utils/reactQueryHooks'

export default function ExpensesList() {
    const [createMode, setCreateMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [expensesToDelete, setExpensesToDelete] = useState([])
    const scrollContainer = useRef(null)

    const query = useFetchExpenses()
    const deleteBulk = useDeleteExpenses()

    const handleCheckboxChange = (e) => {
        const expenseId = e.target.id
        const index = expensesToDelete.indexOf(expenseId)
        if (index >= 0) {
            setExpensesToDelete(expensesToDelete.toSpliced(index, 1))
        } else {
            setExpensesToDelete([...expensesToDelete, expenseId])
        }
    }

    usePrefetchExpenses()
    useInfiniteScroll(scrollContainer, query)

    return (
        <div className='expenses-list'>
            {deleteMode && <ConfirmationPopup
                message={`Are you sure you want to delete ${expensesToDelete.length} expense record${expensesToDelete.length === 1 ? '' : 's'}?`}
                onConfirm={() => {
                    deleteBulk.mutate(expensesToDelete)
                    setExpensesToDelete([])
                    setDeleteMode(false)
                }}
                onCancel={() => setDeleteMode(false)}
            />}
            <div className='list-ctrls'>
                <button onClick={() => setCreateMode(true)}>+</button>
                {expensesToDelete.length > 0 && <button onClick={() => setDeleteMode(true)}>Delete selected</button>}
                {expensesToDelete.length > 0 && <button onClick={() => setExpensesToDelete([])}>Cancel</button>}
            </div>
            <div className={`list-column ${expensesToDelete.length > 0 ? 'visible-checkbox' : ''}`} ref={scrollContainer}>
                {createMode && <ExpensesForm onCancel={() => setCreateMode(false)} onSubmit={() => setCreateMode(false)} />}
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.pages.map((page) => {
                    return page.map(expense => (
                        <Expense
                            data={expense}
                            key={expense.id}
                            isChecked={expensesToDelete.indexOf(expense.id) > -1}
                            onCheckboxChange={handleCheckboxChange}
                        />

                    ))
                })}
                {query.isFetchingNextPage && <span>Loading more...</span>}
                {!query.hasNextPage && <span>Nothing more to load</span>}
            </div>

        </div >
    )
}