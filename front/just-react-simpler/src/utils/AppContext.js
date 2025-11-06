import { createContext, useContext, useState } from "react"

const SelectedCategoryContext = createContext(null)

export function AppContext({ children }) {
    const [selectedCategory, setSelectedCategory] = useState(null)
    return (
        <SelectedCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </SelectedCategoryContext.Provider>
    )
}

export function useSelectedCategory() {
    return useContext(SelectedCategoryContext)
}