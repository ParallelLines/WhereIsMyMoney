import { useState } from 'react'
import VanishingBlock from './VanishingBlock'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrencies } from '../apiService/currencies'
import { getCategories } from '../apiService/categories'
import { formatDateForInput } from '../utils/date'
import { createExpense, editExpense } from '../apiService/expenses'

export default function ExpensesForm({ expenseData, onCancel, onSubmit }) {
    const queryClient = useQueryClient()
    const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity })
    const currenciesQuery = useQuery({ queryKey: ['currencies'], queryFn: getCurrencies, staleTime: Infinity })

    const create = useMutation({
        mutationFn: createExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currencies'] })
        }
    })
    const edit = useMutation({ mutationFn: editExpense })

    const [expense, setExpense] = useState(expenseData ? expenseData : {
        name: '',
        sum: '',
        category_id: categoriesQuery.data?.[0].id,
        category_name: '',
        color: '',
        date: new Date()
    })
    const date = formatDateForInput(expenseData ? new Date(expenseData.date) : new Date(expense.date))

    const handleChange = (e) => {
        setExpense(currExpense => {
            return {
                ...currExpense,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const cat = categoriesQuery.data?.find(c => c.id === expense.category_id)
        expense.currency = expense.currency ? expense.currency : currenciesQuery.data?.[0].name
        expense.sum = expense.sum.replace(',', '.')
        if (Number.isInteger(parseFloat(expense.sum))) {
            expense.sum = parseFloat(expense.sum) + '.00'
        }
        const preppedExpense = {
            ...expense,
            'category_name': cat.name,
            'color': cat.color
        }
        if (!expenseData) {
            create.mutate(preppedExpense)
        } else {
            edit.mutate(preppedExpense)
        }
        onSubmit()
    }

    if (categoriesQuery.isPending || currenciesQuery.isPending) {
        return <div>Loading...</div>
    }
    if (categoriesQuery.isError || currenciesQuery.isError) {
        return <div>Error loading data</div>
    }

    return (
        <VanishingBlock containerClassName="expenses-form-container" background="blur" onClose={onCancel}>
            <form className="inline-form" onSubmit={handleSubmit}>
                <input name="name"
                    className="standart-input"
                    aria-label="name of expense"
                    value={expense.name}
                    onChange={handleChange}
                    placeholder="name"
                    autoFocus
                    required
                />
                <input name="sum"
                    className="short-input"
                    aria-label="expense amount"
                    value={expense.sum}
                    onChange={handleChange}
                    placeholder="45.99"
                    required
                />
                {currenciesQuery.isLoading && <span>Loading...</span>}
                <select name="currency"
                    className="short-input"
                    aria-label="expense currency"
                    onChange={handleChange}
                    value={expense.currency}
                    required
                >
                    {currenciesQuery.data?.map(currency =>
                        <option key={currency.name} value={currency.name}>
                            {currency.symbol} {currency.name}
                        </option>)}
                </select>
                <input name="date"
                    aria-label="expense date"
                    type="datetime-local"
                    onChange={handleChange}
                    defaultValue={date}
                />
                {categoriesQuery.isLoading && <span>Loading...</span>}
                <select name="category_id"
                    aria-label="category of the expense"
                    onChange={handleChange}
                    defaultValue={expense.category_id}
                    required
                >
                    {categoriesQuery.data?.map(category =>
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>)}
                </select>
                <div className="btns">
                    <button type="submit" disabled={create.isPending || edit.isPending}>
                        {expenseData ? 'Save' : 'Create'}
                    </button>
                    <button onClick={onCancel} disabled={create.isPending || edit.isPending}>
                        Cancel
                    </button>
                </div>
            </form>

        </VanishingBlock>
    )
}