import { useLoaderData, useNavigate, redirect, Form } from "react-router-dom"
import { getCategories } from "../rest/categories"
import { createOneExpense } from "../rest/expenses"
import { formatDateForInput } from "../utils/date"

export async function loader() {
    const userId = 2
    const categories = await getCategories(userId)
    return categories
}

export async function action({ request, params }) {
    const userId = 2
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    updates['user_id'] = userId
    const status = await createOneExpense(userId, updates)
    if (status === 200) {
        return redirect(`/`)
    } else {
        console.log('error')
    }
}

export default function ExpenseEditForm() {
    const categories = useLoaderData()
    const navigate = useNavigate()

    const date = formatDateForInput(new Date())

    return (
        <Form className="basic-form" id="expense-create-form" method="POST">
            <label>
                <span>Name</span>
                <input
                    placeholder="a shop name"
                    aria-label="expense name"
                    type="text"
                    name="name"
                />
            </label><br />
            <label>
                <span>Category</span>
                <select
                    name="category_id"
                    aria-label="category name"
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
                />
            </label><br />
            <label>
                <span>Currency</span>
                <input
                    placeholder="$"
                    aria-label="currency"
                    type="text"
                    name="currency"
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