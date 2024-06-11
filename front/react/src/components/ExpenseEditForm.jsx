import { useLoaderData, useNavigate, redirect, Form } from "react-router-dom"
import { getOneExpense } from "../rest/expenses"
import { getCategories } from "../rest/categories"

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
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    console.log(request.method)
    console.log(updates)
    return redirect(`/`)
}

export default function ExpenseEditForm() {
    const { expense, categories } = useLoaderData()
    const navigate = useNavigate()
    const date = formatDateForInput(new Date(expense.date))
    return (
        <Form className="EditForm" id="expense-edit-form" method="PUT">
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
                    defaultValue={{ label: expense.category_name, value: expense.category_id }}
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

function formatDateForInput(date) {
    //returns YYYY-MM-DDTHH:mm format
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
}