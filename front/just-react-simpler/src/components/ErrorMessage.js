import { useEffect, useState } from 'react'
import { useErrorQueue } from '../utils/AppContext'

export default function ErrorMessage({ id, message, timeout = 3000 }) {
    const [visible, setVisible] = useState(true)
    const [timeToFade, setTimeToFade] = useState(false)
    const { removeError } = useErrorQueue()

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeToFade(true)
            setTimeout(() => {
                setVisible(false)
                removeError(id)
            }, 300)
        }, timeout)

        return () => {
            clearTimeout(timer)
        }
    }, [timeout, id, removeError])

    if (!visible) return null

    return (
        <div className={`error-message ${timeToFade ? 'fade-out' : ''}`}>
            {message}
        </div>
    )
}