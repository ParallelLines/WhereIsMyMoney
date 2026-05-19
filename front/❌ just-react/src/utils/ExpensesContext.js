import { createContext, useContext, useReducer } from 'react'

const ExpensesContext = createContext(null)
const ExpensesDispatchContext = createContext(null)

export function ExpensesProvider({ children }) {
    const [expenses, dispatch] = useReducer(expensesReducer, [])

    return (
        <ExpensesContext.Provider value={expenses}>
            <ExpensesDispatchContext.Provider value={dispatch}>
                {children}
            </ExpensesDispatchContext.Provider>
        </ExpensesContext.Provider>
    )
}

export function useExpenses() {
    return useContext(ExpensesContext)
}

export function useExpensesDispatch() {
    return useContext(ExpensesDispatchContext)
}

function expensesReducer(expenses, action) {
    switch (action.type) {
        case 'insert_all': {
            if (!action.expenses) {
                throw Error(`Action ${action.type} should contain data in action.expenses`)
            }
            return [...action.expenses]
        }
        case 'insert': {
            if (!action.expense) {
                throw Error(`Action ${action.type} should contain data in action.expense`)
            }
            const copy = [...expenses]
            copy.unshift(action.expense)
            return copy
        }
        case 'update': {
            if (!action.expense) {
                throw Error(`Action ${action.type} should contain data in action.expense`)
            }
            const copy = [...expenses]
            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id === action.expense.id) {
                    Object.assign(copy[i], action.expense)
                    break
                }
            }
            return copy
        }
        case 'update_category': {
            if (!action.category) {
                throw Error(`Action ${action.type} should contain data in action.category`)
            }
            const copy = [...expenses]
            const category = action.category
            copy.filter(e => e.category_id === category.id)
                .forEach(e => {
                    if (category.name) {
                        console.log('updating expenses with category ', category)
                        e.category_name = category.name
                        e.color = category.color
                    } else {
                        console.log('deleting category from expenses')
                        e.category_id = null
                        e.category_name = null
                        e.color = null
                    }
                })
            console.log('expenses context: ', copy)
            return copy
        }
        case 'delete': {
            if (!action.expense) {
                throw Error(`Action ${action.type} should contain data in action.expense`)
            }
            const copy = [...expenses]
            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id === action.expense.id) {
                    copy.splice(i, 1)
                    break
                }
            }
            return copy
        }
        default: {
            throw Error('Unknown action type: ' + action.type)
        }
    }
}