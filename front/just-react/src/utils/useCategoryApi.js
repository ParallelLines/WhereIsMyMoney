import { useState } from 'react'
import { createCategory, deleteCategory, editCategory, getCategories } from './apiService'

export default function useCategoryApi() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const getAll = async () => {
        setLoading(true)
        return getCategories()
            .catch(e => {
                console.log('Error trying to request categories: ', e)
                setError('couldn\'t get the data :(')
            })
            .finally(() => setLoading(false))
    }

    const create = async (data) => {
        return createCategory(data)
            .catch(e => {
                console.log('Error trying to create a categorie: ', e)
                setError('couldn\'t create a category :(')
            })
    }

    const edit = async (id, data) => {
        return editCategory(id, data)
            .catch(e => {
                console.log('Error trying to edit a categorie: ', e)
                setError('couldn\'t edit a category :(')
            })
    }

    const remove = async (id) => {
        return deleteCategory(id)
            .catch(e => {
                console.log('Error trying to delete a categorie: ', e)
                setError('couldn\'t delete a category :(')
            })
    }

    return { getAll, create, edit, remove, loading, error }
}