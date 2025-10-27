import { useRef, useState, useCallback } from 'react'
import { useClickOnBg } from '../utils/useClickHooks'

/**
 * 
 * @param {String} background blur or just null 
 * @returns 
 */
export default function VanishingBlock({ children, containerClassName, background, onClose }) {
    const [open, setOpen] = useState(true)
    const backgroundRef = useRef(null)
    const blockRef = useRef(null)
    const bgClass = 'vanishing-bg ' + (background ? background : 'clear')

    const close = useCallback(() => {
        setOpen(false)
        if (onClose) onClose()
    }, [onClose])

    useClickOnBg(backgroundRef, blockRef, close)

    return (
        open &&
        <div className={bgClass} ref={backgroundRef}>
            <div className={containerClassName} ref={blockRef}>
                {children}
            </div>
        </div>
    )
}