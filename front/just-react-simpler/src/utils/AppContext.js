import { createContext, useCallback, useContext, useState } from 'react'

const SelectedCategoryContext = createContext(null)
const ErrorQueueContext = createContext(null)

export function AppContext({ children }) {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [errorQueue, setErrorQueue] = useState([])

    const addError = useCallback((message) => {
        setErrorQueue(prevQueue => [...prevQueue, { id: Date.now(), message: message }])
    }, [])

    const removeError = useCallback((id) => {
        setErrorQueue(prevQueue => prevQueue.filter(err => err.id !== id))
    }, [])

    return (
        <SelectedCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            <ErrorQueueContext.Provider value={{ errorQueue, addError, removeError }}>
                {children}
            </ErrorQueueContext.Provider>
        </SelectedCategoryContext.Provider>
    )
}

export function useSelectedCategory() {
    return useContext(SelectedCategoryContext)
}

export function useErrorQueue() {
    return useContext(ErrorQueueContext)
}