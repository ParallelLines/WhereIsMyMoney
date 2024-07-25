import { useEffect, useState } from 'react'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const ENDPOINT = BACKEND_URL + '/categories'

export default function CategoriesTree() {
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        const response = await axios.get(ENDPOINT)
            .catch(e => console.log('Error trying to request categories: ', e))
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