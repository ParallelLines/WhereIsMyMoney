import { useSelectedCategory } from '../utils/AppContext'
import { useMemo, useState } from 'react'
import { useFetchPieStats } from '../utils/reactQueryHooks'
import PieChart from './PieChart'

export default function PieChartScreen({ width = 300, height = 300 }) {
    const { selectedCategory } = useSelectedCategory()
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
    const query = useFetchPieStats()

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const calculateMonth = (k = 0) => {
        const offset = currentMonthOffset + k
        if (offset > currentMonth) {
            return months[12 - Math.abs(currentMonth - offset)]
        }
        return months[currentMonth - offset]
    }

    const calculateYear = (k = 0) => {
        const offsetBeforePrevYear = currentMonth + 1
        if (currentMonthOffset + k >= offsetBeforePrevYear) return currentYear - 1
        return currentYear
    }

    const sortOutZeroes = (data) => {
        return data?.filter(d => d.sumUSD > 0)
    }

    const filterAccordingToLevel = () => {
        if (!query.data) return
        if (selectedCategory) {
            return query.data.filter(d => d.id === selectedCategory || d.parent_id === selectedCategory)
        }
        return query.data.filter(d => d.parent_id === null)
    }

    const prepareData = (data) => {
        if (!data) return
        const preparedData = []
        for (let category of data) {
            const newData = JSON.parse(JSON.stringify(category))
            if (category.id === selectedCategory) {
                // without children
                if (currentMonthOffset === null) {
                    // using all_time_sums
                    newData.sumUSD = newData.all_time_sum_inUSD
                    newData.sums = [...newData.all_time_sums]
                } else {
                    // using last_months_sums
                    const monthSums = newData.last_months_sums[currentMonthOffset]
                    newData.sumUSD = monthSums ? monthSums.sum_inUSD : 0
                    newData.sums = monthSums ? monthSums.currencies : []
                }
            } else {
                // with children
                if (currentMonthOffset === null) {
                    // using all_time_sums
                    newData.sumUSD = newData.all_time_sum_with_children_inUSD
                    newData.sums = [...newData.all_time_sums]
                } else {
                    // using last_months_sums
                    const monthSums = newData.last_months_sums[currentMonthOffset]
                    newData.sumUSD = monthSums ? monthSums.sum_with_children_inUSD : 0
                    newData.sums = monthSums ? monthSums.currencies : []
                }
            }
            preparedData.push(newData)
        }
        return preparedData
    }

    const caclulateTotal = (data) => {
        const result = []
        for (let category of data) {
            for (let sum of category.sums) {
                const currency = result.find(c => c.name === sum.name)
                if (currency) {
                    currency.sum += sum.sum ? sum.sum : 0
                    currency.sum_inUSD += sum.sum_inUSD ? sum.sum_inUSD : 0
                    currency.sum_with_children += sum.sum_with_children ? sum.sum_with_children : sum.sum
                    currency.sum_with_children_inUSD += sum.sum_with_children_inUSD ? sum.sum_with_children_inUSD : sum.sum_inUSD
                } else {
                    result.push({
                        ...sum,
                        sum_with_children: sum.sum_with_children ? sum.sum_with_children : sum.sum,
                        sum_with_children_inUSD: sum.sum_with_children_inUSD ? sum.sum_with_children_inUSD : sum.sum_inUSD
                    })
                }
            }
        }
        return result
    }

    const displayTotal = (data) => {
        if (!data) return ''
        const totals = caclulateTotal(data)
        const totalsSorted = totals.sort((a, b) => {
            if (data.id === selectedCategory) {
                return b.sum_inUSD - a.sum_inUSD
            } else {
                return b.sum_with_children_inUSD - a.sum_with_children_inUSD
            }
        })
        const totalsFiltered = totalsSorted.filter(sum => {
            if (data.id === selectedCategory) {
                return sum.sum > 0
            } else {
                return sum.sum_with_children > 0
            }
        })
        return totalsFiltered?.map(t => `${data.id === selectedCategory ? t.sum.toFixed(2) : t.sum_with_children.toFixed(2)} ${t.symbol}`).join(', ')
    }

    const getSelectedCategoryName = () => {
        if (!query.data) return '...'
        if (selectedCategory !== null) {
            const category = query.data?.find(c => c.id === selectedCategory)
            if (category) {
                return category.name
            } else {
                return '?'
            }
        }
        return 'all'
    }

    const filteredData = useMemo(() => filterAccordingToLevel(), [filterAccordingToLevel, query.data, selectedCategory])
    const preparedData = useMemo(() => prepareData(filteredData), [prepareData, filteredData, selectedCategory, currentMonthOffset])
    const displayData = useMemo(() => sortOutZeroes(preparedData), [preparedData])

    return (
        <div className='pie-chart'>
            {query.isLoading && <div>Loading...</div>}
            {query.isError && <div>Error: {query.error.message}</div>}
            <PieChart
                width={width}
                height={height}
                data={displayData}
            />
            <div className='top-left'>
                {currentMonthOffset !== null &&
                    <button
                        className='pie-chart-btn'
                        onClick={() => setCurrentMonthOffset(null)}
                    >
                        All Time Total
                    </button>
                }
                {currentMonthOffset === null &&
                    <button
                        className='pie-chart-btn'
                        onClick={() => setCurrentMonthOffset(0)}
                    >
                        Current Month
                    </button>
                }
            </div>
            <div className='middle-left'>
                {currentMonthOffset !== null &&
                    <button
                        className={`pie-chart-btn side-btn ${currentMonthOffset === 11 ? ' dull' : ''}`}
                        onClick={() => setCurrentMonthOffset(prev => Math.min(prev + 1, 11))}
                        disabled={currentMonthOffset === 11}
                    >
                        ←<br />{calculateMonth(1)}<br />{calculateYear(1)}
                    </button>
                }
            </div>
            <div className='middle-right'>
                {currentMonthOffset !== null &&
                    <button
                        className={`pie-chart-btn side-btn ${currentMonthOffset === 0 ? ' dull' : ''}`}
                        onClick={() => setCurrentMonthOffset(prev => Math.max(prev - 1, 0))}
                        disabled={currentMonthOffset === 0}
                    >
                        →<br />{calculateMonth(-1)}<br />{calculateYear(-1)}
                    </button>
                }
            </div>
            <div className='bottom-left'>
                <div className='pie-chart-info'>
                    Category: <span className='bold'>{getSelectedCategoryName()}</span>
                </div>
                {currentMonthOffset !== null &&
                    <div className='pie-chart-info'>
                        <span className='highlighted'>{calculateMonth()} {calculateYear()}</span>: <span className='bold'>{displayTotal(displayData)}</span>
                    </div>
                }
                {currentMonthOffset === null &&
                    <div className='pie-chart-info'>
                        <span className='highlighted'>All time</span>: <span className='bold'>{displayTotal(displayData)}</span>
                    </div>
                }
            </div>

        </div >
    )
}