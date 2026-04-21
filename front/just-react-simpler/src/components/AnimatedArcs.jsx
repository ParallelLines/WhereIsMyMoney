import { animated, to, useTransition } from '@react-spring/web'

export default function AnimatedArcs({ pie, hoveredSegment, handleClick, handleMouseMove, setHoveredSegment }) {
    const transitions = useTransition(pie.arcs, {
        keys: (arc) => arc.data.id,
        from: (arc) => ({
            startAngle: arc.endAngle > Math.PI ? 2 * Math.PI : 0,
            endAngle: arc.endAngle > Math.PI ? 2 * Math.PI : 0,
            opacity: 0,
        }),
        enter: (arc) => ({
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            opacity: 1,
        }),
        update: (arc) => ({
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            opacity: 1,
        }),
        leave: (arc) => ({
            startAngle: arc.endAngle > Math.PI ? 2 * Math.PI : 0,
            endAngle: arc.endAngle > Math.PI ? 2 * Math.PI : 0,
            opacity: 0,
        })
    })
    return transitions((spring, arc, { key }) => {
        const [centroidX, centroidY] = pie.path.centroid(arc)
        const isHovered = hoveredSegment?.id === arc.data.id
        const dimOthers = hoveredSegment && !isHovered
        const scale = isHovered ? 1.1 : 1
        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.55
        return (
            <g
                key={key}
                onClick={() => handleClick(arc.data.id, arc.data.parent_id)}
                onMouseMove={e => handleMouseMove(e, arc.data)}
                onMouseLeave={() => setHoveredSegment(null)}
            >
                <animated.path
                    d={to([spring.startAngle, spring.endAngle], (sa, ea) =>
                        pie.path({ ...arc, startAngle: sa, endAngle: ea })
                    )}
                    fill={`#${arc.data.color}`}
                    fillOpacity={dimOthers ? 0.35 : 1}
                    stroke='white'
                    strokeWidth={1}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                        transition: 'all 0.2s ease'
                    }}
                />
                {hasSpaceForLabel &&
                    <text
                        x={centroidX}
                        y={centroidY}
                        dy='.33em'
                        fill='white'
                        fontSize={12}
                        fontWeight='600'
                        textAnchor='middle'
                        pointerEvents='none'
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                    >
                        {arc.data.name}
                    </text>}
            </g>
        )
    })
}