import Expense from "./Expense"
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from "../apiService/expenses"

export default function ExpensesList() {
    const query = useQuery({ queryKey: ['expenses'], queryFn: getExpenses })

    return (
        <div className="expenses-list list-column">
            {query.data?.map(expense => {
                return (
                    <Expense data={expense} key={expense.id} />
                )
            })}
        </div>
    )
}