import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'

const ENDPOINT = '/categories'

export default function CategoriesTree() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        const response = await axiosInstance
            .get(ENDPOINT)
            .catch(e => {
                console.log('Error trying to request categories: ', e)
                setError('couldn\'t get the data :(')
            })
        if (response) setCategories(response.data)
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <div className="categories-tree">
            {categories.map(cat => <div>cat.name</div>)}
        </div>
    )
}