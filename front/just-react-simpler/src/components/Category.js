import { useState } from 'react'
import { useSelectedCategory } from '../utils/AppContext'
import ColorMarker from './ColorMarker'
import IconAdd from './icons/IconAdd'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'
import { useDeleteCategory } from '../utils/reactQueryHooks'
import ConfirmationPopup from './ConfirmationPopup'
import CategoryForm from './CategoryForm'

export default function Category({ categoryData }) {
    const [createMode, setCreateMode] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)

    const { selectedCategory, setSelectedCategory } = useSelectedCategory()
    const selected = selectedCategory === categoryData.id

    const del = useDeleteCategory()
    const deleteWarning = `Are you sure you want to delete ${categoryData.name} category? If it has child categories, they will be deleted too.`

    const handleSelect = () => {
        if (selectedCategory === categoryData.id) {
            setSelectedCategory(null)
        } else {
            setSelectedCategory(categoryData.id)
        }
    }

    return (
        <>
            {!editMode &&
                < div className={`list-item category level-${categoryData.level} ${selected ? 'selected' : ''}`}>
                    {deleteMode && <ConfirmationPopup
                        message={deleteWarning}
                        onConfirm={() => {
                            del.mutate(categoryData.id)
                            setDeleteMode(false)
                        }}
                        onCancel={() => setDeleteMode(false)}
                    />}
                    <span className='category-name' onClick={handleSelect}>{categoryData.name}</span>
                    <ColorMarker name={categoryData.name} color={categoryData.color} />
                    <div className='invisible-ctrls'>
                        <button
                            className='icon-btn invisible-ctrl'
                            title='Add'
                            onClick={() => setCreateMode(true)}>
                            <IconAdd />
                        </button>
                        <button
                            className='icon-btn invisible-ctrl'
                            title='Edit'
                            onClick={() => setEditMode(true)}>
                            <IconEdit />
                        </button>
                        <button
                            className='icon-btn invisible-ctrl'
                            title='Delete'
                            onClick={() => setDeleteMode(true)}>
                            <IconDelete />
                        </button>
                    </div>
                </div >
            }
            {createMode &&
                <CategoryForm
                    parentId={categoryData.id}
                    level={Number(categoryData.level) + 1}
                    onCancel={() => setCreateMode(false)}
                    onSubmit={() => setCreateMode(false)}
                />
            }
            {editMode &&
                <CategoryForm
                    categoryData={categoryData}
                    onCancel={() => setEditMode(false)}
                    onSubmit={() => setEditMode(false)}
                />
            }
        </>
    )
}