import { useSelectedCategory } from '../utils/AppContext'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { localPoint } from '@visx/event'
import { useRef, useState } from 'react'
import { useFetchPieStats } from '../utils/reactQueryHooks'

export default function PieChart({ width = 300, height = 300 }) {
    const { selectedCategory, setSelectedCategory } = useSelectedCategory()
    const [hoveredSegment, setHoveredSegment] = useState(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
    const svgRef = useRef(null)
    const query = useFetchPieStats()

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    const handleMouseMove = (e, segmentData) => {
        const coords = localPoint(e)
        const svgRect = svgRef.current.getBoundingClientRect()
        setTooltipPos({
            x: coords.x + svgRect.left,
            y: coords.y + svgRect.top
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
        }
    }

    const prepareStatsData = (data) => {
        if (!selectedCategory) {
            const filteredData = data?.filter(d => d.parent_id === null && d.sum_total_with_children.length)
            return filteredData
        }
        const filteredData = data?.filter(d => d.id === selectedCategory || d.parent_id === selectedCategory)
        return filteredData
    }

    const displayData = prepareStatsData(query.data)

    return (
        <div className='pie-chart'>
            {query.isLoading && <div>Loading...</div>}
            {query.isError && <div>Error: {query.error.message}</div>}
            <svg width={width} height={height} ref={svgRef}>
                <Group left={centerX} top={centerY}>
                    <Pie
                        data={displayData}
                        pieValue={data => data.sum_total_with_children.reduce((acc, curr) => acc += curr.sum_inUSD, 0)}
                        startAngle={0}
                        endAngle={2 * Math.PI}
                        innerRadius={0}
                        outerRadius={radius}
                        cornerRadius={3}
                    >
                        {pie => (
                            <>
                                {pie.arcs.map((arc, i) => {
                                    const [centroidX, centroidY] = pie.path.centroid(arc)
                                    const isHovered = hoveredSegment?.id === arc.data.id
                                    const dimOthers = hoveredSegment && !isHovered
                                    const scale = isHovered ? 1.1 : 1
                                    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.55
                                    return (
                                        <g
                                            key={`arc-${arc.data.id}-${i}`}
                                            onClick={() => handleClick(arc.data.id, arc.data.parent_id)}
                                            onMouseMove={e => handleMouseMove(e, arc.data)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                        >
                                            <path
                                                key={`arc-${arc.data.id}`}
                                                d={pie.path(arc)}
                                                fill={`#${arc.data.color}`}
                                                fillOpacity={dimOthers ? 0.35 : 1}
                                                stroke='white'
                                                strokeWidth={1}
                                                style={{
                                                    transform: `scale(${scale})`,
                                                    transformOrigin: '0 0',
                                                    transition: 'all 0.2s ease',
                                                    filter: isHovered
                                                        ? 'drop-shadow(0 0 6px rgba(0,0,0,0.25)) drop-shadow(0 0 14px rgba(0,0,0,0.12))'
                                                        : 'none'
                                                }}
                                            />
                                            {hasSpaceForLabel &&
                                                <text
                                                    x={centroidX}
                                                    y={centroidY}
                                                    dy='.33em'
                                                    fill='white'
                                                    fontSize={14}
                                                    fontWeight='600'
                                                    textAnchor='middle'
                                                    pointerEvents='none'
                                                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                                                >
                                                    {arc.data.name}
                                                </text>}
                                        </g>
                                    )
                                })}
                            </>
                        )}
                    </Pie>
                </Group>
            </svg>

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
                    {hoveredSegment.sum_total_with_children.map(sum => (
                        <div>{sum.sum} {sum.symbol}</div>
                    ))}
                </div>
            )}
        </div>
    )
}