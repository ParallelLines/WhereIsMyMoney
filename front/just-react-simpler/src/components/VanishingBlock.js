import { useRef, useState, useCallback } from 'react'
import { useCalculatePosition, useCalculatePositionWithRef, useClickOnBg } from '../utils/hooks'

/**
 * @param {String} anchorClassName if defined, a div with this className
 * @param {String} background blur or just null
 * @returns 
 */
export default function VanishingBlock({ children, anchorClassName, anchorRef, popoverWidth = 200, popoverHeight = 200, containerClassName, background, onClose }) {
    const [open, setOpen] = useState(true)
    const backgroundRef = useRef(null)
    const blockRef = useRef(null)

    const { ref, position: positionByClassName } = useCalculatePosition()
    const positionByRef = useCalculatePositionWithRef(anchorRef, popoverWidth, popoverHeight)

    const bg = background ? ' ' + background : ' clear'
    const centered = !anchorClassName && !anchorRef ? ' centered' : ''
    const bgClass = 'vanishing-bg' + bg + centered

    const close = useCallback(() => {
        setOpen(false)
        if (onClose) onClose()
    }, [onClose])

    let style = {
        position: 'relative'
    }
    if (positionByClassName) {
        style.left = positionByClassName.x + 'px'
        style.top = positionByClassName.y + 'px'
    }
    if (positionByRef) {
        style.position = 'fixed'
        style.left = positionByRef.x + 'px'
        style.top = positionByRef.y + 'px'
    }

    useClickOnBg(backgroundRef, blockRef, close)

    return (
        open &&
        <>
            {anchorClassName &&
                <div className={anchorClassName} ref={ref}></div>
            }
            {(positionByClassName || !anchorClassName) &&
                <div className={bgClass} ref={backgroundRef}>
                    <div className={containerClassName} ref={blockRef} style={style}>
                        {children}
                    </div>
                </div>
            }
        </>
    )
}