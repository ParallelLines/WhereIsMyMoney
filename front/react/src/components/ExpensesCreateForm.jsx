import { useLoaderData, useNavigate, redirect, Form } from "react-router-dom"

export async function action({ request, params }) {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    console.log(request.method)
    console.log(updates)
    return redirect(`/`)
}

export default function ExpenseEditForm() {
    const expense = useLoaderData()
    const navigate = useNavigate()
    return (
        <Form className="EditForm" id="expense-create-form" method="POST">
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
                <input
                    placeholder="category name"
                    aria-label="category name"
                    type="text"
                    name="category_id"
                />
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
                    placeholder=""
                    aria-label="expense date"
                    type="datetime-local"
                    name="date"
                />
            </label><br />
            <button type="submit">Save</button>
            <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </Form>
    )
}