import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import CategoriesTreeItem from './CategoriesTreeItem'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'
import IconAdd from './IconAdd'
import SkeletonCategorieTree from './SkeletonCategorieTree'

const ENDPOINT = '/categories'

/**
 * category structure:
 * { id, user_id, parent_id, name, color }
 */

export default function CategoriesTree({ onSelect }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])
    const [createMode, setCreateMode] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

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
                break
            }
        }
    }

    const removeDeletedCategory = (id) => {
        let start = 0
        const countChildren = (start, parentId) => {
            const parents = {}
            parents[parentId] = true
            let qty = 0
            for (let i = start; i < categories.length; i++) {
                const potentialParent = categories[i].id
                if (parents[categories[i].parent_id]) {
                    parents[potentialParent] = true
                    qty += 1
                }
            }
            return qty
        }

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
                start = i
                break
            }
        }
        categories.splice(start, 1 + countChildren(start + 1, categories[start].id))
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
                    if (cat.id === selectedCategory) {
                        return <CategoriesTreeItem
                            key={cat.id}
                            actions={actions}
                            categoryData={{ ...cat }}
                            dummyCategory={newEmptyCategory}
                            selected={true}
                        />
                    }
                    return <CategoriesTreeItem
                        key={cat.id}
                        actions={actions}
                        dummyCategory={newEmptyCategory}
                        categoryData={{ ...cat }}
                    />
                })}
            </div>
        </div>
    )
}