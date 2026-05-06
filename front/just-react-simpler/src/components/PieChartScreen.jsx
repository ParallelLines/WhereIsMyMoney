import { useFilterContext } from '../utils/AppContext'
import { useMemo } from 'react'
import { useFetchPieStats } from '../utils/reactQueryHooks'
import { getMonthYearByOffset } from '../utils/date'
import { filterAccordingToLevel, preparePieData, displayPieTotal } from '../utils/statsHelper'
import PieChart from './PieChart'

export default function PieChartScreen({ width = 300, height = 300 }) {
    const { selectedCategory, setSelectedCategory, monthOffset, setMonthOffset } = useFilterContext()
    const query = useFetchPieStats()

    const prevMonthYear = getMonthYearByOffset(monthOffset + 1)
    const currMonthYear = getMonthYearByOffset(monthOffset)
    const nextMonthYear = getMonthYearByOffset(monthOffset - 1)

    const sortOutZeroes = (data) => {
        return data?.filter(d => d.sumUSD > 0)
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

    const filteredData = useMemo(() => filterAccordingToLevel(selectedCategory, query.data), [filterAccordingToLevel, query.data, selectedCategory])
    const preparedData = useMemo(() => preparePieData(selectedCategory, monthOffset, filteredData), [preparePieData, filteredData, selectedCategory, monthOffset])
    const displayData = useMemo(() => sortOutZeroes(preparedData), [preparedData])

    return (
        <div className='pie-chart-screen'>
            {query.isLoading && <div>Loading...</div>}
            {query.isError && <div>Error: {query.error.message}</div>}
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
            <div className='middle'>
                <div className='pie-chart-info'>
                    <span className='title'>
                        {monthOffset === null ? 'All time' : `${currMonthYear.name} ${currMonthYear.year}`}
                    </span>
                    <button
                        className='pie-chart-btn'
                        onClick={() => setMonthOffset(monthOffset === null ? 0 : null)}
                    >
                        {monthOffset === null ? 'Current Month' : 'All Time Total'}
                    </button>
                    <span className='title'>
                        {getSelectedCategoryName()}
                        {selectedCategory !== null &&
                            <button
                                className='pie-chart-btn'
                                onClick={() => setSelectedCategory(null)}
                                title='reset category'
                            >
                                X
                            </button>

                        }
                    </span>
                    <div className='sum-list'>
                        {!displayData?.length && <span>No data for this period</span>}
                        {displayData?.length > 0 && displayPieTotal(selectedCategory, displayData).map((sum, i) => (
                            <span className='' key={i}>{sum}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}