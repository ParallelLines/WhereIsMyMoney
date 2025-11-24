import { useState } from 'react'
import { useCreateRegular, useEditRegular, useFetchCategories, useFetchCurrencies, useMonitorErrors } from '../utils/reactQueryHooks'
import VanishingBlock from './VanishingBlock'
import { formatDateForInput } from '../utils/date'
import { prepareSum } from '../utils/useful'
import ButtonsGrid from './ButtonsGrid'
import { useErrorQueue } from '../utils/AppContext'

export default function RegularExpenseForm({ regularData, onCancel, onSubmit }) {
    const categoriesQuery = useFetchCategories()
    const currenciesQuery = useFetchCurrencies()
    const create = useCreateRegular()
    const edit = useEditRegular()

    const repeatInterval = ['daily', 'weekly', 'monthly', 'yearly']
    const daysOfMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const dayNums = ['first', 'second', 'third', 'forth', 'fifth', 'last']
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekdaysExtended = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'day', 'weekday', 'weekend day']

    const [infinite, setInfinite] = useState(true)
    const [interval, setInterval] = useState(regularData ? regularData.repeat_interval : repeatInterval[2])
    const [repeatEach, setRepeatEach] = useState(true)
    const [repeatOn, setRepeatOn] = useState(false)
    const { addError } = useErrorQueue()

    const now = new Date()
    const yearLater = new Date().setFullYear(now.getFullYear() + 1)
    const weekdayToday = weekdays[now.getDay()]
    const dateToday = daysOfMonth[now.getDate() - 1]
    const monthToday = months[now.getMonth()]

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
        repeat_each_day_of_month: [dateToday],
        repeat_each_month: [],
        repeat_on_day_num: dayNums[0],
        repeat_on_weekday: weekdays[0]
    })

    console.log('regular: ', regular)

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

    const setDaysOfMonth = (selectedDaysOfMonth) => {
        const numArray = selectedDaysOfMonth.map(dayStr => Number.parseInt(dayStr))
        setRegular(currRegular => {
            return {
                ...currRegular,
                repeat_each_day_of_month: numArray
            }
        })
    }

    const setMonths = (selectedMonths) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                repeat_each_month: selectedMonths
            }
        })
    }

    const handleRadioChange = (e) => {
        if (e.target.value === 'each') {
            setRepeatEach(true)
        } else {
            setRepeatEach(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (infinite) regular.end_date = null
        regular.sum = prepareSum(regular.sum)
        regular.currency = regular.currency ? regular.currency : currenciesQuery.data?.[0].name
        regular.repeat_interval = interval
        if (repeatEach) {
            regular.repeat_on_day_num = null
            regular.repeat_on_weekday = null
        } else {
            regular.repeat_each_day_of_month = null
        }
        try {
            if (!regularData) {
                await create.mutateAsync(regular)
            } else {
                await edit.mutateAsync(regular)
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
                    {currenciesQuery.isPending && <div>Loading...</div>}
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
                    {categoriesQuery.isPending && <div>Loading...</div>}
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
                        required
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
                            <ButtonsGrid width={7} values={weekdays} defaultSelected={regular.repeat_each_weekday} onSelect={setWeekdays} />
                        </div>
                    </>
                }

                {interval === 'monthly' &&
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
                        <span> month{regular.repeat_every === '1' || regular.repeat_every === 1 ? '' : 's'}</span>

                        <div className='line'>
                            <input name='repeatGroup'
                                id='repeatGroupEach'
                                type='radio'
                                value='each'
                                onChange={handleRadioChange}
                                checked={repeatEach}
                            ></input>
                            <label htmlFor='repeatGroupEach'>each</label>
                            <ButtonsGrid width={7} values={daysOfMonth} defaultSelected={regular.repeat_each_day_of_month} onSelect={setDaysOfMonth} disabled={!repeatEach} />
                        </div>

                        <div className='line'>
                            <input name='repeatGroup'
                                id='repeatGroupOn'
                                type='radio'
                                value='on'
                                onChange={handleRadioChange}
                                checked={!repeatEach}
                            ></input>
                            <label htmlFor='repeatGroupOn'>on</label>
                            <select name='repeat_on_day_num'
                                aria-label='on which day by number to repeat'
                                onChange={handleChange}
                                defaultValue={regular.repeat_on_day_num}
                                disabled={repeatEach}
                                required
                            >
                                {dayNums.map(dayNum =>
                                    <option key={dayNum} value={dayNum}>
                                        {dayNum}
                                    </option>)}
                            </select>
                            <select name='repeat_on_weekday'
                                aria-label='on which weekday to repeat'
                                onChange={handleChange}
                                defaultValue={regular.repeat_on_weekday}
                                disabled={repeatEach}
                                required
                            >
                                {weekdaysExtended.map(weekday =>
                                    <option key={weekday} value={weekday}>
                                        {weekday}
                                    </option>)}
                            </select>
                        </div>
                    </>
                }

                {interval === 'yearly' &&
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
                        <span> year{regular.repeat_every === '1' || regular.repeat_every === 1 ? '' : 's'}</span>

                        <div className='line'>
                            <span>in: </span>
                            <ButtonsGrid width={4} values={months} defaultSelected={monthToday} onSelect={setMonths} />
                        </div>
                        <div className='line'>
                            <input type='checkbox'
                                id='repeatOn'
                                onChange={() => setRepeatOn(!repeatOn)}
                                checked={repeatOn}
                            ></input>
                            <label htmlFor='repeatOn'>on the:</label>
                            <select name='repeat_on_day_num'
                                aria-label='on which day by number to repeat'
                                onChange={handleChange}
                                defaultValue={regular.repeat_on_day_num}
                                disabled={!repeatOn}
                                required
                            >
                                {dayNums.map(dayNum =>
                                    <option key={dayNum} value={dayNum}>
                                        {dayNum}
                                    </option>)}
                            </select>
                            <select name='repeat_on_weekday'
                                aria-label='on which weekday to repeat'
                                onChange={handleChange}
                                defaultValue={regular.repeat_on_weekday}
                                disabled={!repeatOn}
                                required
                            >
                                {weekdaysExtended.map(weekday =>
                                    <option key={weekday} value={weekday}>
                                        {weekday}
                                    </option>)}
                            </select>
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