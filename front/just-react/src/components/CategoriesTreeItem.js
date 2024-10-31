import { useState } from 'react'
import ColorMarker from './ColorMarker'
import IconAdd from './icons/IconAdd'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'
import { useCategoriesDispatch, useSelectedCategory } from '../utils/CategoriesContext'
import useCategoryApi from '../utils/useCategoryApi'

export default function CategoriesTreeItem({ categoryData, dummyCategory }) {
    const categoriesDispatch = useCategoriesDispatch()
    const { create, edit, remove } = useCategoryApi()
    const { selectedCategory, setSelectedCategory } = useSelectedCategory()

    const [editMode, setEditMode] = useState(categoryData ? false : true)
    const [createMode, setCreateMode] = useState(false)

    const selected = categoryData.id === selectedCategory
    const containerClassName = 'categories-tree-item' + (selected ? ' selected' : '')
    const level = categoryData ? categoryData.level : '1'
    const levelToCreate = categoryData ? parseInt(categoryData.level) + 1 : '2'
    const mainContainer = containerClassName + ' level-' + level
    const secondContainer = containerClassName + ' level-' + levelToCreate

    const newCategoryData = {
        ...dummyCategory,
        parent_id: categoryData.id,
        level: levelToCreate
    }

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

    const handleEdit = async (data) => {
        await edit(data)
            .then(() => categoriesDispatch({
                type: 'update',
                category: data
            }))
        setEditMode(false)
    }

    const handleDelete = async (id) => {
        await remove(id)
            .then(() => categoriesDispatch({
                type: 'delete',
                category: { id: id }
            }))
    }

    const handleSelect = () => {
        if (selectedCategory === categoryData.id) {
            setSelectedCategory(null)
        } else {
            setSelectedCategory(categoryData.id)
        }
    }

    return (
        <>
            <div className={mainContainer}>
                {editMode && <CategoriesTreeItemForm
                    onSubmit={handleEdit}
                    onCancel={() => setEditMode(false)}
                    categoryData={categoryData}
                />}
                {!editMode && categoryData &&
                    <>
                        <span className="text-standart" onClick={handleSelect}>{categoryData.name}</span>
                        <ColorMarker name={categoryData.name} color={categoryData.color} />
                        <button
                            className="icon-btn invisible-btn"
                            title="Add"
                            onClick={() => setCreateMode(true)}>
                            <IconAdd />
                        </button>
                        <button
                            className="icon-btn invisible-btn"
                            title="Edit"
                            onClick={() => setEditMode(true)}>
                            <IconEdit />
                        </button>
                        <button
                            className="icon-btn invisible-btn"
                            title="Delete"
                            onClick={() => handleDelete(categoryData.id)}>
                            <IconDelete />
                        </button>
                    </>}
            </div>
            {createMode &&
                <div className={secondContainer}>
                    <CategoriesTreeItemForm
                        onSubmit={handleCreate}
                        onCancel={() => setCreateMode(false)}
                        categoryData={newCategoryData}
                    />
                </div>}
        </>
    )
}