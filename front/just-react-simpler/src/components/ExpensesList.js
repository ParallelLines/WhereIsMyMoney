import Expense from './Expense'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteExpenses, getExpenses } from '../apiService/expenses'
import { useRef, useState } from 'react'
import ExpensesForm from './ExpensesForm'
import ConfirmationPopup from './ConfirmationPopup'
import { useInfiniteScroll } from '../utils/hooks'

export default function ExpensesList() {
    const queryClient = useQueryClient()
    const [createMode, setCreateMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [expensesToDelete, setExpensesToDelete] = useState([])
    const scrollContainer = useRef(null)

    const query = useInfiniteQuery({
        queryKey: ['expenses'],
        queryFn: getExpenses,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
        staleTime: Infinity
    })

    const prefetchExpenses = async () => {
        await queryClient.prefetchInfiniteQuery({
            queryKey: ['expenses'],
            queryFn: getExpenses,
            pages: 5,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages, lastPageParam) => {
                if (lastPage.length === 0) {
                    return undefined
                }
                return lastPageParam + 1
            },
            staleTime: Infinity
        })
    }

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

    prefetchExpenses()
    useInfiniteScroll(scrollContainer, query)

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
            <div className={expensesToDelete.length > 0 ? "list-column visible-checkbox" : "list-column"} ref={scrollContainer}>
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