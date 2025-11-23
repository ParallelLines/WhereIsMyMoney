import { useState } from 'react'
import VanishingBlock from './VanishingBlock'
import { formatDateForInput } from '../utils/date'
import { useCreateExpense, useEditExpense, useFetchCategories, useFetchCurrencies, useMonitorErrors } from '../utils/reactQueryHooks'
import { prepareSum } from '../utils/useful'
import { useErrorQueue } from '../utils/AppContext'

export default function ExpensesForm({ expenseData, onCancel, onSubmit }) {
    const categoriesQuery = useFetchCategories()
    const currenciesQuery = useFetchCurrencies()
    const create = useCreateExpense()
    const edit = useEditExpense()
    const { addError } = useErrorQueue()

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
        expense.currency = expense.currency ? expense.currency : currenciesQuery.data?.[0].name
        expense.sum = prepareSum(expense.sum)
        try {
            if (!expenseData) {
                await create.mutateAsync(expense)
            } else {
                await edit.mutateAsync(expense)
            }
            onSubmit()
        } catch (error) {
            if (error.response) {
                addError('Fail: ' + error.response.data)
            } else {
                addError('Fail: ' + error.message)
            }
        }
    }

    useMonitorErrors(currenciesQuery, onCancel)
    useMonitorErrors(categoriesQuery, onCancel)

    return (
        <VanishingBlock
            background='blur'
            containerClassName='expenses-form-container'
            onClose={onCancel}
        >
            <form className='inline-form' onSubmit={handleSubmit}>
                <input name='name'
                    className='standart-input'
                    aria-label='name of expense'
                    value={expense.name}
                    onChange={handleChange}
                    placeholder='name'
                    autoFocus
                    required
                />
                <input name='sum'
                    className='short-input'
                    aria-label='expense amount'
                    value={expense.sum}
                    onChange={handleChange}
                    placeholder='45.99'
                    required
                />
                {currenciesQuery.isLoading && <span>Loading...</span>}
                <select name='currency'
                    aria-label='expense currency'
                    onChange={handleChange}
                    value={expense.currency}
                    required
                >
                    {currenciesQuery.data?.map(currency =>
                        <option key={currency.name} value={currency.name}>
                            {currency.symbol} {currency.name}
                        </option>)}
                </select>
                <input name='date'
                    aria-label='expense date'
                    type='datetime-local'
                    onChange={handleChange}
                    defaultValue={date}
                />
                {categoriesQuery.isLoading && <span>Loading...</span>}
                <select name='category_id'
                    aria-label='category of the expense'
                    onChange={handleChange}
                    defaultValue={expense.category_id}
                    required
                >
                    {categoriesQuery.data?.map(category =>
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>)}
                </select>
                <div className='btns'>
                    <button className='positive' type='submit' disabled={create.isPending || edit.isPending}>
                        {expenseData ? 'Save' : 'Create'}
                    </button>
                    <button className='negative' onClick={onCancel} disabled={create.isPending || edit.isPending}>
                        Cancel
                    </button>
                </div>
            </form>

        </VanishingBlock>
    )
}