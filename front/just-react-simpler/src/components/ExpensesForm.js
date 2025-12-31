import { useState } from 'react'
import VanishingBlock from './VanishingBlock'
import { formatDateForInput } from '../utils/date'
import { useCreateExpense, useEditExpense, useFetchCategories, useFetchCurrencies, useMonitorErrors } from '../utils/reactQueryHooks'
import { prepareSum } from '../utils/useful'
import { useErrorQueue } from '../utils/AppContext'
import CategoriesSelect from './CategoriesSelect'
import ColorMarker from './ColorMarker'
import CategoriesSuggestion from './CategoriesSuggestion'
import ExpenseNameSuggestion from './ExpenseNameSuggestion'

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
        category_name: categoriesQuery.data?.[0].name,
        color: categoriesQuery.data?.[0].color,
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

    const changeCategory = (category) => {
        setExpense(currExpense => {
            return {
                ...currExpense,
                category_id: category.id,
                category_name: category.name,
                color: category.color
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
                <div className='line'>
                    <ExpenseNameSuggestion
                        searchStr={expense.name}
                        onChange={(expenseName) => setExpense(currExpense => {
                            return {
                                ...currExpense,
                                name: expenseName
                            }
                        })}
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
                </div>
                <div className='line'>
                    <CategoriesSelect
                        selectedCategoryId={expense.category_id}
                        onChange={changeCategory}
                    />
                    <ColorMarker name={expense.category_name} color={expense.color} />
                    <CategoriesSuggestion searchStr={expense.name} onSelect={changeCategory} />
                </div>
                <div className='line btns'>
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