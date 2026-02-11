import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const FilterContext = createContext(null)
const ErrorQueueContext = createContext(null)

export function AppContext({ children }) {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedRegular, setSelectedRegular] = useState(null)
    const [monthOffset, setMonthOffset] = useState(0)
    const [errorQueue, setErrorQueue] = useState([])

    const addError = useCallback((message) => {
        setErrorQueue(prevQueue => [...prevQueue, { id: Date.now(), message: message }])
    }, [])

    const removeError = useCallback((id) => {
        setErrorQueue(prevQueue => prevQueue.filter(err => err.id !== id))
    }, [])

    const value = useMemo(() => ({
        selectedCategory, setSelectedCategory,
        selectedRegular, setSelectedRegular,
        monthOffset, setMonthOffset
    }), [selectedCategory, selectedRegular, monthOffset])

    return (
        <FilterContext.Provider value={value}>
            <ErrorQueueContext.Provider value={{ errorQueue, addError, removeError }}>
                {children}
            </ErrorQueueContext.Provider>
        </FilterContext.Provider>
    )
}

export function useFilterContext() {
    return useContext(FilterContext)
}

export function useErrorQueue() {
    return useContext(ErrorQueueContext)
}