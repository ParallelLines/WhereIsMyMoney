import { createContext, useCallback, useContext, useState } from 'react'

const SelectedCategoryContext = createContext(null)
const SelectedRegularContext = createContext(null)
const MonthOffsetContext = createContext(null)
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

    return (
        <SelectedCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            <SelectedRegularContext.Provider value={{ selectedRegular, setSelectedRegular }}>
                <MonthOffsetContext.Provider value={{ monthOffset, setMonthOffset }}>
                    <ErrorQueueContext.Provider value={{ errorQueue, addError, removeError }}>
                        {children}
                    </ErrorQueueContext.Provider>
                </MonthOffsetContext.Provider>
            </SelectedRegularContext.Provider>
        </SelectedCategoryContext.Provider>
    )
}

export function useSelectedCategory() {
    return useContext(SelectedCategoryContext)
}

export function useSelectedRegular() {
    return useContext(SelectedRegularContext)
}

export function useMonthOffset() {
    return useContext(MonthOffsetContext)
}

export function useErrorQueue() {
    return useContext(ErrorQueueContext)
}