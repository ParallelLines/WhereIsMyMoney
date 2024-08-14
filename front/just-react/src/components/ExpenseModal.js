import { useRef, useState } from 'react'
import IconClose from './IconClose'

export default function ExpenseModal({ data }) {
    const [open, setOpen] = useState(true)
    const modalRef = useRef(null)
    const ignoreFirstClick = useRef(false)

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && ignoreFirstClick.current && !modalRef.current.contains(e.target)) {
                setOpen(false)
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
        <div className="modal" ref={modalRef}>
            <button className="icon-btn" onClick={() => setOpen(false)}><IconClose /></button>
            {children}
        </div>
    )
}