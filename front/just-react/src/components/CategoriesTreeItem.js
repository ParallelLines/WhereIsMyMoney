import { useState } from 'react'
import ColorMarker from './ColorMarker'
import IconAdd from './icons/IconAdd'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'

export default function CategoriesTreeItem({ actions, categoryData, dummyCategory, selected }) {
    const [editMode, setEditMode] = useState(categoryData ? false : true)
    const [createMode, setCreateMode] = useState(false)

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

    const handleCreate = (data) => {
        actions.create(data)
        setCreateMode(false)
    }

    const handleEdit = (data) => {
        actions.edit(data)
        setEditMode(false)
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
                        <span className="text-standart" onClick={() => { actions.select(categoryData.id) }}>{categoryData.name}</span>
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
                            onClick={() => actions.delete(categoryData.id)}>
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