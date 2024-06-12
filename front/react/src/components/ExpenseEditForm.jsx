import { useLoaderData, useNavigate, redirect, Form } from "react-router-dom"
import { getOneExpense, editOneExpense } from "../rest/expenses"
import { getCategories } from "../rest/categories"
import { formatDateForInput } from "../utils/date"

export async function loader({ params }) {
    const expenseId = params.id
    const userId = 2
    const expense = await getOneExpense(expenseId)
    const categories = await getCategories(userId)
    const result = {
        expense: expense[0],
        categories: categories
    }
    return result
}

export async function action({ request, params }) {
    const id = params.id
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const status = await editOneExpense(id, updates)
    if (status === 200) {
        return redirect(`/`)
    } else {
        console.log('error')
    }
}

export default function ExpenseEditForm() {
    const { expense, categories } = useLoaderData()
    const navigate = useNavigate()
    const date = formatDateForInput(new Date(expense.date))
    return (
        <Form className="basic-form" id="expense-edit-form" method="PUT">
            <label>
                <span>Name</span>
                <input
                    placeholder="a shop name"
                    aria-label="expense name"
                    type="text"
                    name="name"
                    defaultValue={expense.name}
                />
            </label><br />
            <label>
                <span>Category</span>
                <select
                    name="category_id"
                    aria-label="category name"
                    defaultValue={expense.category_id}
                >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </label><br />
            <label>
                <span>Sum</span>
                <input
                    placeholder="99.99"
                    aria-label="expense sum"
                    type="text"
                    name="sum"
                    defaultValue={expense.sum}
                />
            </label><br />
            <label>
                <span>Currency</span>
                <input
                    placeholder="$"
                    aria-label="currency"
                    type="text"
                    name="currency"
                    defaultValue={expense.currency}
                />
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
            <button type="submit">Save</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </Form>
    )
}