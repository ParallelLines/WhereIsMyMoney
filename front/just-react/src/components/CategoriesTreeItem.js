import { useState } from 'react'
import ColorMarker from './ColorMarker'
import IconAdd from './IconAdd'
import IconEdit from './IconEdit'
import IconDelete from './IconDelete'
import CategoriesTreeItemForm from './CategoriesTreeItemForm'

export default function CategoriesTreeItem({ actions, categoryData }) {
    const [editMode, setEditMode] = useState(categoryData ? false : true)
    const [createMode, setCreateMode] = useState(false)

    const containerClassName = 'categories-tree-item'
    const level = categoryData ? categoryData.level : '1'
    const levelToCreate = categoryData ? parseInt(categoryData.level) + 1 : '2'
    const mainContainer = containerClassName + ' level-' + level
    const secondContainer = containerClassName + ' level-' + levelToCreate

    const newCategoryData = {
        name: '',
        color: '',
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
                        <div className="text-standart">{categoryData.name}</div>
                        <ColorMarker name={categoryData.name} color={categoryData.color} />
                        <button className="icon-btn invisible-btn" onClick={() => setCreateMode(true)}><IconAdd /></button>
                        <button className="icon-btn invisible-btn" onClick={() => setEditMode(true)}><IconEdit /></button>
                        <button className="icon-btn invisible-btn" onClick={() => actions.delete(categoryData.id)}><IconDelete /></button>
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
    // const [isCreateMode, setCreateMode] = useState(categoryData ? false : true)
    // const [isEditMode, setEditMode] = useState(false)
    // const [catName, setCatName] = useState(category ? category.name : '')
    // const [catColor, setCatColor] = useState(category ? category.color : '')

    // const level = category ? category.level : '1'
    // const containerClassName = 'categories-tree-item level-' + level

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     if (isCreateMode) {
    //         console.log('creating category: ', category)
    //         await actions.create(category)
    //         setCreateMode = false
    //     }
    // }

    // const handleCancel = (e) => {
    //     setCreateMode(false)
    //     if (actions.cancel) actions.cancel()
    // }

    // return (
    //     <div className={containerClassName}>
    //         {(isCreateMode || isEditMode) &&
    //             <form className="inline-form">
    //                 <input name="name"
    //                     className="category-form-input"
    //                     value={category ? category.name : ''}
    //                     placeholder="name"
    //                     onChange={handleChange}
    //                 ></input>
    //                 <input name="color"
    //                     className="category-form-input"
    //                     value={category ? category.color : ''}
    //                     placeholder="ffffff"
    //                     onChange={handleChange}
    //                 ></input>
    //                 <button onSubmit={handleSubmit}>Save</button>
    //                 <button onClick={handleCancel}>Cancel</button>
    //             </form>}

    //         {!isCreateMode && !isEditMode && category &&
    //             <>
    //                 <div className="text-standart">{category.name}</div>
    //                 <ColorMarker name={category.name} color={category.color} />
    //                 <button className="icon-btn invisible-btn"><IconAdd /></button>
    //                 <button className="icon-btn invisible-btn"><IconEdit /></button>
    //                 <button className="icon-btn invisible-btn"><IconDelete /></button>
    //             </>
    //         }
    //     </div>
    // )
}