import { useCallback, useMemo, useState } from 'react'
import { useCreateRegular, useEditRegular, useFetchCategories, useFetchCurrencies, useFetchNextDate, useMonitorErrors } from '../utils/reactQueryHooks'
import VanishingBlock from './VanishingBlock'
import { convertDateToDatetime, formatDateForDateInput } from '../utils/date'
import { prepareSum } from '../utils/useful'
import ButtonsGrid from './ButtonsGrid'
import { useErrorQueue } from '../utils/AppContext'
import { useQueryClient } from '@tanstack/react-query'
import { dateString } from '../utils/date'
import CategoriesSelect from './CategoriesSelect'

export default function RegularExpenseForm({ regularData, onCancel, onSubmit }) {
    const queryClient = useQueryClient()
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
    const triggerDateChangeFields = new Set(['start_date', 'end_date', 'repeat_interval', 'repeat_every'])

    const [infinite, setInfinite] = useState(regularData?.end_date ? false : true)
    const [interval, setInterval] = useState(regularData ? regularData.repeat_interval : repeatInterval[2])
    const [repeatEach, setRepeatEach] = useState(regularData ? !regularData.repeat_on_day_num : true)
    const [repeatOn, setRepeatOn] = useState(regularData ? regularData.repeat_on_day_num : false)
    const { addError } = useErrorQueue()

    const now = new Date()
    const yearLater = new Date().setFullYear(now.getFullYear() + 1)
    const weekdayToday = weekdays[now.getDay()]
    const dateToday = now.getDate().toString()
    const monthToday = months[now.getMonth()]

    if (regularData && !regularData.end_date) regularData.end_date = yearLater

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
        repeat_each_month: [monthToday],
        repeat_on_day_num: dayNums[0],
        repeat_on_weekday: weekdays[0]
    })

    const startDate = formatDateForDateInput(regularData ? new Date(regularData.start_date) : new Date(regular.start_date))
    const endDate = formatDateForDateInput(regularData ? new Date(regularData.end_date) : new Date(regular.end_date))

    const prepareData = useCallback(() => {
        const preparedData = { ...regular }
        preparedData.start_date = convertDateToDatetime(preparedData.start_date)
        preparedData.end_date = convertDateToDatetime(preparedData.end_date)
        if (infinite) preparedData.end_date = null
        preparedData.sum = prepareSum(preparedData.sum)
        preparedData.currency = preparedData.currency ? preparedData.currency : currenciesQuery.data?.[0].name
        preparedData.repeat_interval = interval
        if (repeatEach && !repeatOn) {
            preparedData.repeat_on_day_num = null
            preparedData.repeat_on_weekday = null
            preparedData.repeat_each_day_of_month = preparedData.repeat_each_day_of_month?.map(Number)
        } else {
            preparedData.repeat_each_day_of_month = null
        }
        return preparedData
    }, [regular, interval, repeatEach, repeatOn, infinite, currenciesQuery.data])

    const handleChange = (e) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                [e.target.name]: e.target.value
            }
        })
        if (triggerDateChangeFields.has(e.target.name)) queryClient.invalidateQueries({ queryKey: ['nextDate'] })
    }

    const setWeekdays = (selectedWeekdays) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                repeat_each_weekday: selectedWeekdays
            }
        })
        queryClient.invalidateQueries({ queryKey: ['nextDate'] })
    }

    const setDaysOfMonth = (selectedDaysOfMonth) => {
        const numArray = selectedDaysOfMonth.map(dayStr => Number.parseInt(dayStr))
        setRegular(currRegular => {
            return {
                ...currRegular,
                repeat_each_day_of_month: numArray
            }
        })
        queryClient.invalidateQueries({ queryKey: ['nextDate'] })
    }

    const setMonths = (selectedMonths) => {
        setRegular(currRegular => {
            return {
                ...currRegular,
                repeat_each_month: selectedMonths
            }
        })
        queryClient.invalidateQueries({ queryKey: ['nextDate'] })
    }

    const handleRadioChange = (e) => {
        if (e.target.value === 'each') {
            setRepeatEach(true)
        } else {
            setRepeatEach(false)
            if (regularData) {
                setRegular(currRegular => {
                    return {
                        ...currRegular,
                        repeat_on_day_num: dayNums[0],
                        repeat_on_weekday: weekdays[0]
                    }
                })
            }
        }
        queryClient.invalidateQueries({ queryKey: ['nextDate'] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const preparedRegular = prepareData()
        try {
            if (!regularData) {
                await create.mutateAsync(preparedRegular)
            } else {
                await edit.mutateAsync(preparedRegular)
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

    const preparedData = useMemo(() => {
        return prepareData()
    }, [prepareData])

    const nextDateQuery = useFetchNextDate(preparedData)

    useMonitorErrors(currenciesQuery, onCancel)
    useMonitorErrors(categoriesQuery, onCancel)
    useMonitorErrors(nextDateQuery, onCancel)

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
                    <CategoriesSelect defaultValue={regular.category_id} onChange={handleChange} />
                </div>

                <div className='line'>
                    <label htmlFor='startDate'>start: </label>
                    <input name='start_date'
                        id='startDate'
                        aria-label='regular expense start date'
                        type='date'
                        onChange={handleChange}
                        defaultValue={startDate}
                        required
                    />

                    <label htmlFor='endDate'>end: </label>
                    <input name='end_date'
                        id='endDate'
                        aria-label='regular expense start date'
                        type='date'
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

                {regularData &&
                    <div className='line'>scheduled:
                        {regularData.next_date ? ' ' + dateString(regularData.next_date) : ' never'}
                    </div>
                }

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
                            <ButtonsGrid width={4} values={months} defaultSelected={regular.repeat_each_month} onSelect={setMonths} />
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

                <div className='line'>will be scheduled after saving:
                    {nextDateQuery.isLoading && ' Loading...'}
                    {nextDateQuery.isError && ' Could not calculate the date'}
                    {nextDateQuery.data?.data.next_date ? ' ' + dateString(nextDateQuery.data?.data.next_date) : ''}
                </div>

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