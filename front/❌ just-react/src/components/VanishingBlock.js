import { useRef, useState, useCallback } from 'react'
import useClickOutside from '../utils/useClickOutside'

export default function VanishingBlock({ children, containerClassName, onClose }) {
    const [open, setOpen] = useState(true)
    const vanishingRef = useRef(null)
    const className = 'vanishing-block ' + containerClassName

    const close = useCallback(() => {
        setOpen(false)
        if (onClose) onClose()
    }, [])
    useClickOutside(vanishingRef, close)

    return (
        open &&
        <div className={className} ref={vanishingRef}>
            {children}
        </div>
    )
}