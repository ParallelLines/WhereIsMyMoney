import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import CategoriesTreeItem from './CategoriesTreeItem'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'
import IconAdd from './IconAdd'
import SkeletonCategorieTree from './SkeletonCategorieTree'

const ENDPOINT = '/categories'

export default function CategoriesTree() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])
    const [createMode, setCreateMode] = useState(false)

    const insertNewCategory = (categoryData) => {
        if (!categoryData.parent_id) {
            categories.unshift(categoryData)
            setCategories([...categories])
        } else {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id === categoryData.parent_id) {
                    categories.splice(i + 1, 0, categoryData)
                    setCategories([...categories])
                }
            }
        }
    }

    const updateEditedCategory = (categoryData) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === categoryData.id) {
                categories[i].name = categoryData.name
                categories[i].color = categoryData.color
                setCategories([...categories])
            }
        }
    }

    const removeDeletedCategory = (id) => {
        let start = 0
        let qty = 0
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
                start = i
                qty = 1
            }
            if (categories[i].parent_id === id) {
                qty++
            }
        }
        categories.splice(start, qty)
        setCategories([...categories])
    }

    const getCategories = async () => {
        await axiosInstance
            .get(ENDPOINT)
            .then(response => {
                if (response) {
                    setCategories(response.data)
                    setLoading(false)
                }
            })
            .catch(e => {
                console.log('Error trying to request categories: ', e)
                setError('couldn\'t get the data :(')
            })
    }

    const createCategory = async (categoryData) => {
        await axiosInstance
            .post(ENDPOINT, {
                name: categoryData.name,
                parent_id: categoryData.parent_id,
                color: categoryData.color
            })
            .then(response => {
                if (response) {
                    categoryData.id = response.data[0].id
                    insertNewCategory(categoryData)
                }
            })
            .catch(e => {
                console.log('Error trying to create a categorie: ', e)
                setError('couldn\'t create a category :(')
            })
    }

    const editCategory = async (categoryData) => {
        await axiosInstance
            .put(ENDPOINT + '/' + categoryData.id, {
                name: categoryData.name,
                parent_id: categoryData.parent_id,
                color: categoryData.color
            })
            .then(response => {
                if (response) {
                    updateEditedCategory(categoryData)
                }
            })
            .catch(e => {
                console.log('Error trying to edit a categorie: ', e)
                setError('couldn\'t edit a category :(')
            })
    }

    const deleteCategory = async (id) => {
        await axiosInstance
            .delete(ENDPOINT + '/' + id)
            .then(response => {
                if (response) {
                    removeDeletedCategory(id)
                }
            })
            .catch(e => {
                console.log('Error trying to delete a categorie: ', e)
                setError('couldn\'t delete a category :(')
            })
    }

    const handleCreate = (data) => {
        createCategory(data)
        setCreateMode(false)
    }

    useEffect(() => {
        getCategories()
    }, [])

    const actions = {
        create: createCategory,
        delete: deleteCategory,
        edit: editCategory
    }

    return (
        <div className="categories-tree">
            <h2>Your categories:</h2>
            <span>All</span><button className="icon-btn" onClick={() => setCreateMode(true)}><IconAdd /></button>
            {createMode &&
                <CategoriesTreeItemForm
                    onSubmit={handleCreate}
                    onCancel={() => setCreateMode(false)}
                />}
            {loading && <SkeletonCategorieTree />}
            {categories.map(cat => {
                return <CategoriesTreeItem key={cat.id} actions={actions} categoryData={{ ...cat }} />
            })}
        </div>
    )
}