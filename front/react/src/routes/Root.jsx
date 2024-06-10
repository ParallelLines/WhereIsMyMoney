import Expense from "../components/Expense"
import { getExpenses } from "../rest/expenses"
import { Outlet, useLoaderData, useNavigate } from "react-router-dom"

export async function loader() {
    const userId = 1
    const expenses = await getExpenses(userId)
    return expenses
}

export default function Root() {
    const expenses = useLoaderData()
    const navigate = useNavigate()
    return (
        <div className="Root">
            <div className="AnalyticsData">here should be graphics and diagrams</div>
            <div className="ExpensesHeader">Spent some? <button onClick={() => navigate('/expenses/new')}>+</button>
                <div className="ExpensesList">
                    {expenses.map(e => <Expense key={e.id} data={e} />)}
                </div>
            </div>
            <Outlet />
        </div>
    )
}