import { useState } from 'react'
import VanishingBlock from './VanishingBlock'
import PopoverPicker from './PopoverPicker'
import IconSave from './icons/IconSave'
import IconCancel from './icons/IconCancel'

export default function CategoriesTreeItemForm({ categoryData, onSubmit, onCancel }) {
    const [category, setCategory] = useState(categoryData)

    const handleChange = (e) => {
        setCategory(currCategory => {
            return {
                ...currCategory,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(category)
    }

    const handleCancel = (e) => {
        onCancel()
    }

    const handleColorChange = (color) => {
        setCategory(currCategory => {
            return {
                ...currCategory,
                color: color.slice(1)
            }
        })
    }

    return (
        <VanishingBlock containerClassName="category-inline-form-container" onClose={handleCancel}>
            <form className="inline-form" onSubmit={handleSubmit}>
                <input name="name"
                    className="standart-input"
                    value={category.name}
                    placeholder="name"
                    onChange={handleChange}
                    autoFocus
                    required
                ></input>
                <PopoverPicker color={category.color} onChange={handleColorChange} />
                <div className="btns">
                    <button className="icon-btn" title="Save"><IconSave /></button>
                    <button className="icon-btn" title="Cancel" onClick={handleCancel}><IconCancel /></button>
                </div>
            </form>
        </VanishingBlock>
    )
}