import Expense from "./Expense"

const expenses = [
    { id: '1', user_id: '1', category_id: '24', name: 'onebookshel', category_name: 'hobby', color: 'd1ff42', sum: '7.72', currency: 'EUR', symbol: '€', date: '2025-01-13 16:08:00+01', regular_id: null, regular_name: null },
    { id: '2', user_id: '1', category_id: '25', name: 'May Cafe', category_name: 'restaurants', color: 'c1003d', sum: '16.90', currency: 'EUR', symbol: '€', date: '2025-01-12 16:08:00+01', regular_id: null, regular_name: null },
    { id: '3', user_id: '1', category_id: '19', name: 'Netflix', category_name: 'subscriptions', color: 'ffabd5', sum: '13.99', currency: 'EUR', symbol: '€', date: '2025-01-11 16:08:00+01', regular_id: null, regular_name: null },
    { id: '4', user_id: '1', category_id: '25', name: 'Melt Crêperie', category_name: 'restaurants', color: 'c1003d', sum: '41.00', currency: 'EUR', symbol: '€', date: '2025-01-10 16:07:00+01', regular_id: null, regular_name: null }

]

export default function ExpensesList() {
    return (
        <div className="expenses-list">
            {expenses.map(expense => {
                return (
                    <Expense data={expense} key={expense.id} />
                )
            })}
        </div>
    )
}