import { useFilterContext } from '../utils/AppContext'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { localPoint } from '@visx/event'
import { useState } from 'react'
import AnimatedArcs from './AnimatedArcs'
import { useFetchPieStats } from '../utils/reactQueryHooks'

export default function PieChart({ width = 300, height = 300, data = [] }) {
    const { selectedCategory, setSelectedCategory } = useFilterContext()
    const [hoveredSegment, setHoveredSegment] = useState(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
    const query = useFetchPieStats()

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    const handleMouseMove = (e, segmentData) => {
        const coords = localPoint(e)
        setTooltipPos({
            x: coords.x + 5,
            y: coords.y + 20
        })
        setHoveredSegment(segmentData)
    }

    const handleClick = (id, parentId) => {
        if (id === selectedCategory) {
            setSelectedCategory(parentId)
            return
        }
        const children = query.data?.filter(d => d.parent_id === id)
        if (children.length) {
            setSelectedCategory(id)
        } else {
            const parent = query.data?.filter(d => d.id === parentId)[0]
            setSelectedCategory(parent ? parent.parent_id : null)
        }
    }

    const chooseSumToShow = (segmentId, currency) => {
        if (segmentId === selectedCategory) {
            return currency.sum
        }
        return currency.sum_with_children ? currency.sum_with_children : currency.sum
    }

    return (
        <div className='pie-chart'>
            {!data.length && <div>No data for this period</div>}
            {data.length > 0 && (
                <svg width={width} height={height}>
                    <Group left={centerX} top={centerY}>
                        <Pie
                            data={data}
                            pieValue={data => data.sumUSD}
                            startAngle={0}
                            endAngle={2 * Math.PI}
                            innerRadius={0}
                            outerRadius={radius}
                            cornerRadius={3}
                        >
                            {pie => (
                                <AnimatedArcs
                                    pie={pie}
                                    hoveredSegment={hoveredSegment}
                                    handleClick={handleClick}
                                    handleMouseMove={handleMouseMove}
                                    setHoveredSegment={setHoveredSegment}
                                />
                            )}
                        </Pie>
                    </Group>
                </svg>
            )}

            {hoveredSegment && (
                <div
                    className='pie-chart-tooltip'
                    style={{
                        left: tooltipPos.x + 10,
                        top: tooltipPos.y + 10
                    }}
                >
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                        {hoveredSegment.name}
                    </div>
                    {hoveredSegment.sums?.map((currency, id) => (
                        chooseSumToShow(hoveredSegment.id, currency) > 0 &&
                        <div key={`tooltip-${id}`}>{chooseSumToShow(hoveredSegment.id, currency)} {currency.symbol}</div>
                    ))}
                </div>
            )}
        </div >
    )
}