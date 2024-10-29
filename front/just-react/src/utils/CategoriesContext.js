import { createContext, useContext, useReducer, useState } from 'react'

const CategoriesContext = createContext(null)
const SelectedCategoryContext = createContext(null)
const CategoriesDispatchContext = createContext(null)

export function CategoriesProvider({ children }) {
    const [categories, dispatch] = useReducer(categoriesReducer, [])
    const [selectedCategory, setSelectedCategory] = useState(null)

    return (
        <CategoriesContext.Provider value={categories}>
            <SelectedCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
                <CategoriesDispatchContext.Provider value={dispatch}>
                    {children}
                </CategoriesDispatchContext.Provider>
            </SelectedCategoryContext.Provider>
        </CategoriesContext.Provider>
    )
}

export function useCategories() {
    return useContext(CategoriesContext)
}

export function useCategoriesDispatch() {
    return useContext(CategoriesDispatchContext)
}

export function useSelectedCategory() {
    return useContext(SelectedCategoryContext)
}

function categoriesReducer(categories, action) {
    if (!action.category && !action.categories) {
        throw Error('Action should contain data in action.category or action.categories')
    }
    switch (action.type) {
        case 'insert_all': {
            return [...action.categories]
        }
        case 'insert': {
            const copy = [...categories]
            if (!action.category.parent_id) {
                copy.unshift(action.category)
            } else {
                for (let i = 0; i < copy.length; i++) {
                    if (copy[i].id === action.category.parent_id) {
                        copy.splice(i + 1, 0, action.category)
                        break
                    }
                }
            }
            return copy
        }
        case 'update': {
            const copy = [...categories]
            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id === action.category.id) {
                    copy[i].name = action.category.name
                    copy[i].color = action.category.color
                    return copy
                }
            }
        }
        case 'delete': {
            const copy = [...categories]
            let start = 0
            const countChildren = (start, parentId) => {
                const parents = {}
                parents[parentId] = true
                let qty = 0
                for (let i = start; i < copy.length; i++) {
                    const potentialParent = copy[i].id
                    if (parents[copy[i].parent_id]) {
                        parents[potentialParent] = true
                        qty += 1
                    }
                }
                return qty
            }

            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id === action.category.id) {
                    start = i
                    break
                }
            }
            copy.splice(start, 1 + countChildren(start + 1, copy[start].id))
            return copy
        }
        default: {
            throw Error('Unknown action type: ' + action.type)
        }
    }
}