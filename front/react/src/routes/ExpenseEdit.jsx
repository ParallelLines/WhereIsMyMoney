import { useLoaderData, redirect } from "react-router-dom"
import { getOneExpense, editOneExpense } from "../rest/expenses"
import { getCategories } from "../rest/categories"
import ExpenseForm from "../components/ExpenseForm"
import { getCurrencies } from "../rest/currencies"

export async function loader({ params }) {
    const expenseId = params.id
    const userId = 2
    const expense = await getOneExpense(expenseId)
    const categories = await getCategories(userId)
    const currencies = await getCurrencies()
    const result = {
        expense: expense[0],
        categories: categories,
        currencies: currencies
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

export default function ExpenseEdit() {
    const { expense, categories, currencies } = useLoaderData()
    return <ExpenseForm expense={expense} categories={categories} currencies={currencies} />
}