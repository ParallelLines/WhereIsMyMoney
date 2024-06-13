import { useNavigate, Form } from "react-router-dom"
import { formatDateForInput } from "../utils/date"

export default function ExpenseForm({ expense, categories, currencies }) {
    const navigate = useNavigate()

    const date = formatDateForInput(expense ? new Date(expense.date) : new Date())
    const mostPopularCategory = categories.reduce((acc, curr) => (acc && acc.count > curr.count) ? acc : curr)

    return (
        <Form className="basic-form" id="expense-form" method="POST">
            <label>
                <span>Name</span>
                <input
                    placeholder="a shop name"
                    aria-label="expense name"
                    type="text"
                    name="name"
                    defaultValue={expense ? expense.name : ''}
                    required
                />
            </label><br />
            <label>
                <span>Sum</span>
                <input
                    placeholder="99.99"
                    aria-label="expense sum"
                    type="text"
                    name="sum"
                    defaultValue={expense ? expense.sum : ''}
                    required
                />
            </label><br />
            <label>
                <span>Currency</span>
                <select
                    name="currency"
                    aria-label="currency"
                    defaultValue={expense ? expense.currency : 'EUR'}
                >
                    {currencies.map(cur => <option key={cur.name} value={cur.name}>{cur.name} {cur.symbol}</option>)}
                </select>
            </label><br />
            <label>
                <span>Category</span>
                <select
                    name="category_id"
                    aria-label="category name"
                    defaultValue={expense ? expense.category_id : mostPopularCategory.id}
                >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </label><br />
            <label>
                <span>Date</span>
                <input
                    aria-label="expense date"
                    type="datetime-local"
                    name="date"
                    defaultValue={date}
                />
            </label><br />
            <button type="submit">{expense ? 'Save' : 'Create'}</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </Form>
    )
}