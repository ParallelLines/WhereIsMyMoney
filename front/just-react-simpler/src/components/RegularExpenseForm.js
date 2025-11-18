import { useState } from 'react'
import { useCreateRegular, useEditRegular, useFetchCategories, useFetchCurrencies } from '../utils/reactQueryHooks'
import VanishingBlock from './VanishingBlock'
import { formatDateForInput } from '../utils/date'
import { prepareSum } from '../utils/useful'
import ButtonsGrid from './ButtonsGrid'

export default function RegularExpenseForm({ regularData, onCancel, onSubmit }) {
    const categoriesQuery = useFetchCategories()
    const currenciesQuery = useFetchCurrencies()
    const create = useCreateRegular()
    const edit = useEditRegular()

    const repeatInterval = ['daily', 'weekly', 'monthly', 'yearly']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const dayNums = ['first', 'second', 'third', 'forth', 'fifth', 'last']
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekdaysExtended = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'day', 'weekday', 'weekend day']

    const [infinite, setInfinite] = useState(false)
    const [interval, setInterval] = useState(repeatInterval[2])

    const now = new Date()
    const yearLater = new Date().setFullYear(now.getFullYear() + 1)
    const weekdayToday = weekdays[now.getDay()]

    const [regular, setRegular] = useState(regularData ? regularData : {
        name: '',
        sum: '',
        category_id: categoriesQuery.data?.[0].id,
        category_name: '',
        color: '',
        start_date: now,
        end_date: yearLater,
        repeat_interval: repeatInterval[2],
        repeat_every: 1,
        repeat_each_weekday: [weekdayToday],
        repeat_each_day_of_month: [],
        repeat_each_month: [],
        repeat_on_day_num: dayNums[0],
        repeat_on_weekday: weekdays[0]
    })

    const startDate = formatDateForInput(regularData ? new Date(regularData.start_date) : new Date(regular.start_date))
    const endDate = formatDateForInput(regularData ? new Date(regularData.end_date) : new Date(regular.end_date))

    const handleChange = (e) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                [e.target.name]: e.target.value
            }
        })
    }

    const setWeekdays = (selectedWeekdays) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                repeat_each_weekday: selectedWeekdays
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (infinite) regular.end_date = null
        regular.sum = prepareSum(regular.sum)
        regular.currency = regular.currency ? regular.currency : currenciesQuery.data?.[0].name
        if (!regularData) {
            create.mutate(regular)
        } else {
            edit.mutate(regular)
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
        <VanishingBlock
            // anchorClassName='regular-expense-form'
            background='blur'
            containerClassName='regulars-form-container'
            onClose={onCancel}
        >
            <form className='inline-form' onSubmit={handleSubmit}>
                <div className='line'>
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
                </div>

                <div className='line'>
                    <label htmlFor='startDate'>start: </label>
                    <input name='start_date'
                        id='startDate'
                        aria-label='regular expense start date'
                        type='datetime-local'
                        onChange={handleChange}
                        defaultValue={startDate}
                    />

                    <label htmlFor='endDate'>end: </label>
                    <input name='end_date'
                        id='endDate'
                        aria-label='regular expense start date'
                        type='datetime-local'
                        onChange={handleChange}
                        defaultValue={endDate}
                        disabled={infinite}
                    />
                    <input type='checkbox'
                        id='ifinite'
                        onChange={() => setInfinite(!infinite)}
                        checked={infinite}
                    ></input>
                    <label htmlFor='ifinite'>infinite</label>
                </div>

                <label htmlFor='repeatInterval'>frequency: </label>
                <select name='repeat_interval'
                    id='repeatInterval'
                    aria-label='repeat interval of the regular expense'
                    onChange={(e) => setInterval(e.target.value)}
                    defaultValue={regular.repeat_interval}
                    required
                >
                    {repeatInterval.map(str =>
                        <option key={str} value={str}>
                            {str}
                        </option>)}
                </select>

                {interval === 'daily' &&
                    <>
                        <label htmlFor='repeatEvery'>every: </label>
                        <input name='repeat_every'
                            id='repeatEvery'
                            className='short-input'
                            type='number'
                            value={regular.repeat_every}
                            onChange={handleChange}
                            min='1'
                            required
                        ></input>
                        <span> day{regular.repeat_every === '1' || regular.repeat_every === 1 ? '' : 's'}</span>
                    </>
                }

                {interval === 'weekly' &&
                    <>
                        <label htmlFor='repeatEvery'>every: </label>
                        <input name='repeat_every'
                            id='repeatEvery'
                            className='short-input'
                            type='number'
                            value={regular.repeat_every}
                            onChange={handleChange}
                            min='1'
                            required
                        ></input>
                        <span> week{regular.repeat_every === '1' || regular.repeat_every === 1 ? '' : 's'}</span>
                        <div className='line'>
                            <span>on: </span>
                            <ButtonsGrid width={7} values={weekdays} defaultSelected={weekdayToday} onSelect={setWeekdays} />
                        </div>
                    </>
                }

                <div className='line btns'>
                    <button className='positive' type='submit' disabled={create.isPending || edit.isPending}>
                        {regularData ? 'Save' : 'Create'}
                    </button>
                    <button className='negative' onClick={onCancel} disabled={create.isPending || edit.isPending}>
                        Cancel
                    </button>
                </div>
            </form>
        </VanishingBlock>
    )
}