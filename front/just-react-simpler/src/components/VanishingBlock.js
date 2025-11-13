import { useRef, useState, useCallback } from 'react'
import { useCalculatePosition, useClickOnBg } from '../utils/hooks'

/**
 * 
 * @param {String} background blur or just null 
 * @returns 
 */
export default function VanishingBlock({ children, anchorClassName, containerClassName, background, onClose }) {
    const [open, setOpen] = useState(true)
    const backgroundRef = useRef(null)
    const blockRef = useRef(null)

    const { ref, position } = useCalculatePosition()

    const bg = background ? ' ' + background : ' clear'
    const centered = !anchorClassName ? ' centered' : ''
    const bgClass = 'vanishing-bg' + bg + centered

    const close = useCallback(() => {
        setOpen(false)
        if (onClose) onClose()
    }, [onClose])

    let style = {
        position: 'relative'
    }
    if (position) {
        style.left = position.x + 'px'
        style.top = position.y + 'px'
    }

    useClickOnBg(backgroundRef, blockRef, close)

    return (
        open &&
        <>
            {anchorClassName &&
                <div className={anchorClassName} ref={ref}></div>
            }
            {(position || !anchorClassName) &&
                <div className={bgClass} ref={backgroundRef}>
                    <div className={containerClassName} ref={blockRef} style={style}>
                        {children}
                    </div>
                </div>
            }
        </>
    )
}