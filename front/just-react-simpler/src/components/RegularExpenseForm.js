import { useState } from 'react';
import { useCreateRegular, useEditRegular, useFetchCategories, useFetchCurrencies } from '../utils/reactQueryHooks';
import VanishingBlock from './VanishingBlock';

export default function RegularExpenseForm({ regularData, onCancel, onSubmit }) {
    const categoriesQuery = useFetchCategories()
    const currenciesQuery = useFetchCurrencies()
    const create = useCreateRegular()
    const edit = useEditRegular()

    const [regular, setRegular] = useState(regularData ? regularData : {
        name: '',
        sum: '',
        category_id: categoriesQuery.data?.[0].id,
        category_name: '',
        color: '',
        date: new Date()
    })

    const handleChange = (e) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        onSubmit()
    }

    if (categoriesQuery.isPending || currenciesQuery.isPending) {
        return <div>Loading...</div>
    }
    if (categoriesQuery.isError || currenciesQuery.isError) {
        return <div>Error loading data</div>
    }

    return (
        <VanishingBlock
            anchorClassName='regular-expense'
            containerClassName='regulars-form-container'
            onClose={onCancel}
        >
            <form className='inline-form' onSubmit={handleSubmit}>
                <input name='name'
                    className='standart-input'
                    aria-label='name of regular expense'
                    value={regular.name}
                    onChange={handleChange}
                    placeholder='name'
                    autoFocus
                    required
                />
                <input name='sum'
                    className='short-input'
                    aria-label='regular expense amount'
                    value={regular.sum}
                    onChange={handleChange}
                    placeholder='45.99'
                    required
                />
                <select name='currency'
                    className='short-input'
                    aria-label='regular expense currency'
                    onChange={handleChange}
                    value={regular.currency}
                    required
                >
                    {currenciesQuery.data?.map(currency =>
                        <option key={currency.name} value={currency.name}>
                            {currency.symbol} {currency.name}
                        </option>)}
                </select>
                <select name='category_id'
                    aria-label='category of the regular expense'
                    onChange={handleChange}
                    defaultValue={regular.category_id}
                    required
                >
                    {categoriesQuery.data?.map(category =>
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>)}
                </select>
                <div className='btns'>
                    <button type='submit' disabled={create.isPending || edit.isPending}>
                        {regularData ? 'Save' : 'Create'}
                    </button>
                    <button onClick={onCancel} disabled={create.isPending || edit.isPending}>
                        Cancel
                    </button>
                </div>
            </form>
        </VanishingBlock>
    )
}