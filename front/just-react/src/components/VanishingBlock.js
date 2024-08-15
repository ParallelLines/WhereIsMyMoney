import { useRef, useState, useEffect } from 'react'

export default function VanishingBlock({ children, containerClassName, onClose }) {
    const [open, setOpen] = useState(true)
    // we need this because the initial click on a '+' button in a parent 
    // CategoryTree or CategoryTreeItem is also counts as an outside click -__-
    // so now the event listener with the help of this variable ignores the first click
    const ignoreFirstClick = useRef(false)
    const vanishingRef = useRef(null)

    const className = 'vanishing-block ' + containerClassName

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (vanishingRef.current && ignoreFirstClick.current && !vanishingRef.current.contains(e.target)) {
                setOpen(false)
                onClose()
            } else {
                ignoreFirstClick.current = true
            }
        }
        document.addEventListener('click', handleOutsideClick, false)
        return () => {
            document.removeEventListener('click', handleOutsideClick, false)
        }
    }, [])

    return (
        open &&
        <div className={className} ref={vanishingRef}>
            {children}
        </div>
    )
}