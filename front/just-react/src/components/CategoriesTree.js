import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import CategoriesTreeItem from './CategoriesTreeItem'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'
import IconAdd from './icons/IconAdd'
import SkeletonCategorieTree from './skeleton/SkeletonCategorieTree'
import { useCategories, useCategoriesDispatch } from './CategoriesContext'

const ENDPOINT = '/categories'

/**
 * category structure:
 * { id, user_id, parent_id, name, color }
 */

export default function CategoriesTree({ onSelect }) {
    const categories = useCategories()
    const categoriesDispatch = useCategoriesDispatch()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [createMode, setCreateMode] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const getCategories = async () => {
        await axiosInstance
            .get(ENDPOINT)
            .then(response => {
                if (response) {
                    categoriesDispatch({
                        type: 'insert_all',
                        categories: response.data
                    })
                    // setCategories(response.data)
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
                    categoriesDispatch({
                        type: 'insert',
                        category: categoryData
                    })
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
                    categoriesDispatch({
                        type: 'update',
                        category: categoryData
                    })
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
                    categoriesDispatch({
                        type: 'delete',
                        category: { id: id }
                    })
                }
            })
            .catch(e => {
                console.log('Error trying to delete a categorie: ', e)
                setError('couldn\'t delete a category :(')
            })
    }

    const selectCategory = (id) => {
        if (selectedCategory === id) {
            setSelectedCategory(null)
            onSelect(null)
        } else {
            setSelectedCategory(id)
            onSelect(id)
        }
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
        edit: editCategory,
        select: selectCategory
    }

    const newEmptyCategory = {
        name: '',
        color: 'ffabd5',
        parent_id: null,
        level: '1'
    }

    return (
        <div className="categories-tree list-column">
            <button
                className="btn-centered"
                onClick={() => setCreateMode(true)}>
                <IconAdd />
            </button>
            {createMode &&
                <CategoriesTreeItemForm
                    categoryData={newEmptyCategory}
                    onSubmit={handleCreate}
                    onCancel={() => setCreateMode(false)}
                />}
            <div className="list-container">
                {loading && <SkeletonCategorieTree />}
                {categories.map(cat => {
                    return <CategoriesTreeItem
                        key={cat.id}
                        actions={actions}
                        dummyCategory={newEmptyCategory}
                        categoryData={{ ...cat }}
                        selected={cat.id === selectedCategory}
                    />
                })}
            </div>
        </div>
    )
}