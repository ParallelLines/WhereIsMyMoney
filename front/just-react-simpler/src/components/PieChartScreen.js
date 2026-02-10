import { useMonthOffset, useSelectedCategory } from '../utils/AppContext'
import { useMemo } from 'react'
import { useFetchPieStats } from '../utils/reactQueryHooks'
import { getMonthYearByOffset } from '../utils/date'
import PieChart from './PieChart'

export default function PieChartScreen({ width = 300, height = 300 }) {
    const { selectedCategory } = useSelectedCategory()
    const { monthOffset, setMonthOffset } = useMonthOffset()
    const query = useFetchPieStats()

    const prevMonthYear = getMonthYearByOffset(monthOffset + 1)
    const currMonthYear = getMonthYearByOffset(monthOffset)
    const nextMonthYear = getMonthYearByOffset(monthOffset - 1)

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
                if (monthOffset === null) {
                    // using all_time_sums
                    newData.sumUSD = newData.all_time_sum_inUSD
                    newData.sums = [...newData.all_time_sums]
                } else {
                    // using last_months_sums
                    const monthSums = newData.last_months_sums[monthOffset]
                    newData.sumUSD = monthSums ? monthSums.sum_inUSD : 0
                    newData.sums = monthSums ? monthSums.currencies : []
                }
            } else {
                // with children
                if (monthOffset === null) {
                    // using all_time_sums
                    newData.sumUSD = newData.all_time_sum_with_children_inUSD
                    newData.sums = [...newData.all_time_sums]
                } else {
                    // using last_months_sums
                    const monthSums = newData.last_months_sums[monthOffset]
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
        return 'All categories'
    }

    // eslint-disable-next-line
    const filteredData = useMemo(() => filterAccordingToLevel(), [filterAccordingToLevel, query.data, selectedCategory])
    // eslint-disable-next-line
    const preparedData = useMemo(() => prepareData(filteredData), [prepareData, filteredData, selectedCategory, monthOffset])
    const displayData = useMemo(() => sortOutZeroes(preparedData), [preparedData])

    return (
        <div className='pie-chart'>
            {query.isLoading && <div>Loading...</div>}
            {query.isError && <div>Error: {query.error.message}</div>}
            <div className='top-left'>
                {monthOffset !== null &&
                    <button
                        className='pie-chart-btn'
                        onClick={() => setMonthOffset(null)}
                    >
                        All Time Total
                    </button>
                }
                {monthOffset === null &&
                    <button
                        className='pie-chart-btn'
                        onClick={() => setMonthOffset(0)}
                    >
                        Current Month
                    </button>
                }
            </div>
            <div className='middle-left'>
                {monthOffset !== null &&
                    <button
                        className={`pie-chart-btn side-btn ${monthOffset === 11 ? ' dull' : ''}`}
                        onClick={() => setMonthOffset(prev => Math.min(prev + 1, 11))}
                        disabled={monthOffset === 11}
                    >
                        ←<br />{prevMonthYear.name}<br />{prevMonthYear.year}
                    </button>
                }
            </div>
            <div className='middle-right'>
                {monthOffset !== null &&
                    <button
                        className={`pie-chart-btn side-btn ${monthOffset === 0 ? ' dull' : ''}`}
                        onClick={() => setMonthOffset(prev => Math.max(prev - 1, 0))}
                        disabled={monthOffset === 0}
                    >
                        →<br />{nextMonthYear.name}<br />{nextMonthYear.year}
                    </button>
                }
            </div>
            <PieChart
                width={width}
                height={height}
                data={displayData}
            />
            <div className='bottom-left'>
                <div className='pie-chart-info'>
                    <span className='bold highlighted'>{getSelectedCategoryName()}</span>
                </div>
                {monthOffset !== null &&
                    <div className='pie-chart-info'>
                        <span className='bold highlighted'>{currMonthYear.name} {currMonthYear.year}</span>: <span className=''>{displayTotal(displayData)}</span>
                    </div>
                }
                {monthOffset === null &&
                    <div className='pie-chart-info'>
                        <span className='bold highlighted'>All time</span>: <span className=''>{displayTotal(displayData)}</span>
                    </div>
                }
            </div>
        </div >
    )
}