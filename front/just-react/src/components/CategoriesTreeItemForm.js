import { useState } from 'react'
import VanishingBlock from './VanishingBlock'

export default function CategoriesTreeItemForm({ categoryData, onSubmit, onCancel }) {
    const [category, setCategory] = useState(categoryData ? categoryData : {
        name: '',
        color: '',
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

    return (
        <VanishingBlock containerClassName="category-inline-form" onClose={handleCancel}>
            <form className="inline-form" onSubmit={handleSubmit}>
                <input name="name"
                    className="category-form-input"
                    value={category.name}
                    placeholder="name"
                    onChange={handleChange}
                    required
                ></input>
                <input name="color"
                    className="category-form-input"
                    value={category.color}
                    placeholder="ffffff"
                    onChange={handleChange}
                    minLength={6}
                    maxLength={6}
                ></input>
                <button>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </VanishingBlock>
    )
}