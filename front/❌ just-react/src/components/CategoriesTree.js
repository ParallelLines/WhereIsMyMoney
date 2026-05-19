import { useEffect, useState } from 'react'
import CategoriesTreeItem from './CategoriesTreeItem'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'
import IconAdd from './icons/IconAdd'
import SkeletonCategorieTree from './skeleton/SkeletonCategorieTree'
import { useCategories, useCategoriesDispatch } from '../utils/CategoriesContext'
import useCategoryApi from '../utils/useCategoryApi'

/**
 * category structure:
 * { id, user_id, parent_id, name, color }
 */

export default function CategoriesTree() {
    const categories = useCategories()
    const categoriesDispatch = useCategoriesDispatch()
    const { getAll, create, loading, error } = useCategoryApi()

    const [createMode, setCreateMode] = useState(false)

    const handleCreate = async (data) => {
        await create(data)
            .then(response => {
                data.id = response.data[0].id
                categoriesDispatch({
                    type: 'insert',
                    category: data
                })
            })
        setCreateMode(false)
    }

    useEffect(() => {
        getAll()
            .then(response => categoriesDispatch({
                type: 'insert_all',
                categories: response.data
            }))
    }, [])

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
                        dummyCategory={newEmptyCategory}
                        categoryData={{ ...cat }}
                    />
                })}
            </div>
        </div>
    )
}