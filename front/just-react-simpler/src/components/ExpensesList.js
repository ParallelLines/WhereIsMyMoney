import Expense from "./Expense"
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from "../apiService/expenses"

export default function ExpensesList() {
    const query = useQuery({ queryKey: ['expenses'], queryFn: getExpenses })

    return (
        <div className="expenses-list list-column">
            <div className="list-controls">
                <button>+</button>
            </div>
            <div className="list-column">
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.map(expense => {
                    return (
                        <Expense data={expense} key={expense.id} />
                    )
                })}
            </div>
        </div>
    )
}