import { useErrorQueue } from '../utils/AppContext'
import ErrorMessage from './ErrorMessage'

export default function ErrorQueue() {
    const { errorQueue } = useErrorQueue()

    if (errorQueue.length === 0) return null

    return (
        <div className='errors-container'>
            {errorQueue.map((error) =>
                <ErrorMessage key={error.id} id={error.id} message={error.message} />
            )}
        </div>
    )
}