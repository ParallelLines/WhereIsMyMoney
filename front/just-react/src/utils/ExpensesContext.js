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
    if (!action.expense && !action.expenses) {
        throw Error('Action should contain data in action.expense or action.expenses')
    }
    switch (action.type) {
        case 'insert_all': {
            return [...action.expenses]
        }
        case 'insert': {
            const copy = [...expenses]
            copy.unshift(action.expense)
            return copy
        }
        case 'update': {
            const copy = [...expenses]
            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id === action.expense.id) {
                    Object.assign(copy[i], action.expense)
                    break
                }
            }
            return copy
        }
        case 'delete': {
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