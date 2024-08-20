import { useEffect, useState } from 'react'
import VanishingBlock from './VanishingBlock'
import PopoverPicker from './PopoverPicker'

export default function CategoriesTreeItemForm({ categoryData, onSubmit, onCancel }) {
    const [category, setCategory] = useState(categoryData ? categoryData : {
        name: '',
        color: 'ffabd5',
        parent_id: null,
        level: '1'
    })

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
                    className="form-input"
                    value={category.name}
                    placeholder="name"
                    onChange={handleChange}
                    required
                ></input>
                <PopoverPicker color={category.color} onChange={handleColorChange} />
                <button>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </VanishingBlock>
    )
}