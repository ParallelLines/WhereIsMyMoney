import { useLoaderData, redirect } from "react-router-dom"
import { getCategories } from "../rest/categories"
import { createOneExpense } from "../rest/expenses"
import { getCurrencies } from "../rest/currencies"
import ExpenseForm from "../components/ExpenseForm"

export async function loader() {
    const userId = 2
    const categories = await getCategories(userId)
    const currencies = await getCurrencies()
    return {
        categories: categories,
        currencies: currencies
    }
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

export default function ExpenseCreate() {
    const { categories, currencies } = useLoaderData()
    return <ExpenseForm categories={categories} currencies={currencies} />
}