import Expense from './Expense'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteExpenses, getExpenses } from '../apiService/expenses'
import { useState } from 'react'
import ExpensesForm from './ExpensesForm'
import ConfirmationPopup from './ConfirmationPopup'

export default function ExpensesList() {
    const queryClient = useQueryClient()
    const [createMode, setCreateMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [expensesToDelete, setExpensesToDelete] = useState([])

    const query = useInfiniteQuery({
        queryKey: ['expenses'],
        queryFn: getExpenses,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        }
    })

    const deleteBulk = useMutation({
        mutationFn: deleteExpenses,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] })
    })

    const handleCheckboxChange = (e) => {
        const expenseId = e.target.id
        const index = expensesToDelete.indexOf(expenseId)
        if (index >= 0) {
            setExpensesToDelete(expensesToDelete.toSpliced(index, 1))
        } else {
            setExpensesToDelete([...expensesToDelete, expenseId])
        }
    }

    return (
        <div className="expenses-list">
            {deleteMode && <ConfirmationPopup
                message={`Are you sure you want to delete ${expensesToDelete.length} expense record${expensesToDelete.length === 1 ? '' : 's'}?`}
                onConfirm={() => deleteBulk.mutate(expensesToDelete)}
                onCancel={() => setDeleteMode(false)}
            />}
            <div className="list-controls">
                <button onClick={() => setCreateMode(true)}>+</button>
                {expensesToDelete.length > 0 && <button onClick={() => setDeleteMode(true)}>Delete Selected</button>}
                {expensesToDelete.length > 0 && <button onClick={() => setExpensesToDelete([])}>Deselect all</button>}
            </div>
            {createMode && <ExpensesForm onCancel={() => setCreateMode(false)} onSubmit={() => setCreateMode(false)} />}
            <div className={expensesToDelete.length > 0 ? "list-column visible-checkbox" : "list-column"}>
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
                <button
                    onClick={() => query.fetchNextPage()}
                    disabled={!query.hasNextPage || query.isFetching}
                >
                    {query.isFetchingNextPage
                        ? 'Loading more...'
                        : query.hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                </button>
            </div>

        </div >
    )
}