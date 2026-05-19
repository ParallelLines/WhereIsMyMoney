import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function BlackHole({ children }) {
    const orbitsFirst = useRef(null)
    const orbitsSecond = useRef(null)
    const orbitsThird = useRef(null)

    const animate = () => {
        const durationFirstMin = 2
        const durationFirstMax = 4
        const durationSecondMax = 6
        const durationThirdMax = 8
        for (let orbit of orbitsFirst.current.children) {
            gsap.to(orbit, {
                rotation: 360,
                duration: durationFirstMin + Math.random() * (durationFirstMax - durationFirstMin),
                repeat: -1,
                transformOrigin: '50% 50%',
                ease: 'none'
            })
        }
        for (let orbit of orbitsSecond.current.children) {
            gsap.to(orbit, {
                rotation: 360,
                duration: durationFirstMax + Math.random() * (durationSecondMax - durationFirstMax),
                repeat: -1,
                transformOrigin: '50% 50%',
                ease: 'none'
            })
        }
        for (let orbit of orbitsThird.current.children) {
            gsap.to(orbit, {
                rotation: 360,
                duration: durationSecondMax + Math.random() * (durationThirdMax - durationSecondMax),
                repeat: -1,
                transformOrigin: '50% 50%',
                ease: 'none'
            })
        }
    }

    useEffect(() => {
        animate()
    }, [])

    return (
        <div className="black-hole-container">
            <div id="black-hole-core-bg"></div>
            <svg className="orbits" height="800" width="800">
                <defs>
                    <filter id="glow">
                        <fegaussianblur className="blur" result="coloredBlur" stdDeviation="4"></fegaussianblur>
                        <femerge>
                            <femergenode in="coloredBlur"></femergenode>
                            <femergenode in="coloredBlur"></femergenode>
                            <femergenode in="coloredBlur"></femergenode>
                            <femergenode in="SourceGraphic"></femergenode>
                        </femerge>
                    </filter>
                </defs>
                <circle className="core" cx="400" cy="400" r="200" stroke="black" strokeWidth="1" strokeDashoffset=""
                    fill="black" />

                <g className="orbits-first" ref={orbitsFirst}>
                    <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="3" fill="none" />
                    <circle cx="400" cy="400" r="205" stroke="white" strokeWidth="4"
                        strokeDasharray="1000 287.4" fill="none" />
                    <circle cx="400" cy="400" r="207" stroke="white" strokeWidth="4" strokeDasharray=""
                        fill="none" />
                    <circle cx="400" cy="400" r="212" stroke="white" strokeWidth="2" strokeDasharray=""
                        fill="none" />
                    <circle cx="400" cy="400" r="215" stroke="white" strokeWidth="2" strokeDasharray=""
                        fill="none" />
                    <circle cx="400" cy="400" r="218" stroke="white" strokeWidth="2"
                        strokeDasharray="1000 394" strokeDashoffset="600" fill="none" />
                </g>

                <g className="orbits-second" ref={orbitsSecond}>
                    <circle cx="400" cy="400" r="219" stroke="white" strokeWidth="2"
                        strokeDasharray="400" strokeDashoffset="" fill="none" />
                    <circle cx="400" cy="400" r="222" stroke="white" strokeWidth="2"
                        strokeDasharray="130" strokeDashoffset="" fill="none" />
                    <circle cx="400" cy="400" r="224" stroke="white" strokeWidth="1"
                        strokeDasharray="150" strokeDashoffset="" fill="none" />
                </g>

                <g className="orbits-third" ref={orbitsThird}>
                    <circle cx="400" cy="400" r="225" stroke="white" strokeWidth="1"
                        strokeDasharray="20 800" strokeDashoffset="" fill="none" />
                    <circle cx="400" cy="400" r="226" stroke="white" strokeWidth="1"
                        strokeDasharray="7 150" strokeDashoffset="300" fill="none" />
                    <circle cx="400" cy="400" r="227" stroke="white" strokeWidth="1"
                        strokeDasharray="6 140" strokeDashoffset="300" fill="none" />
                    <circle cx="400" cy="400" r="228" stroke="white" strokeWidth="1"
                        strokeDasharray="15 700" strokeDashoffset="" fill="none" />
                    <circle cx="400" cy="400" r="228" stroke="white" strokeWidth="1"
                        strokeDasharray="5 600" strokeDashoffset="" fill="none" />
                    <circle cx="400" cy="400" r="228" stroke="white" strokeWidth="1"
                        strokeDasharray="5 600" strokeDashoffset="300" fill="none" />
                </g>
            </svg>
            <div id="black-hole-core-fg">
                {children}
            </div>
        </div>
    )
}