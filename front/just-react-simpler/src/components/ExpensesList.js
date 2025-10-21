import Expense from "./Expense"
import { useInfiniteQuery } from '@tanstack/react-query'
import { getExpenses } from "../apiService/expenses"

export default function ExpensesList() {
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

    return (
        <div className="expenses-list list-column">
            <div className="list-controls">
                <button>+</button>
            </div>
            <div className="list-column">
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.pages.map((page) => {
                    return page.map(expense => (
                        <Expense data={expense} key={expense.id} />
                    ))
                })}
            </div>
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
    )
}