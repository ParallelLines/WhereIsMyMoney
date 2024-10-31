import { useState } from 'react'
import { createExpense, deleteExpense, editExpense, getExpenses } from './apiService'

export default function useExpenseApi() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getAll = async () => {
        setLoading(true)
        return getExpenses()
            .catch(e => {
                console.log('Error trying to request expenses: ', e)
                setError('couldn\'t get the data :(')
            })
            .finally(() => setLoading(false))
    }

    const create = async (data) => {
        return createExpense(data)
            .catch(e => {
                console.log('Error trying to create an expense: ', e)
                setError('couldn\'t create an expense :(')
            })
    }

    const edit = async (id, data) => {
        return editExpense(id, data)
            .catch(e => {
                console.log('Error trying to edit an expense: ', e)
                setError('couldn\'t edit an expense :(')
            })
    }

    const remove = async (id) => {
        return deleteExpense(id)
            .catch(e => {
                console.log('Error trying to delete an expense: ', e)
                setError('couldn\'t delete an expense :(')
            })
    }

    return { getAll, create, edit, remove, loading, error }
}