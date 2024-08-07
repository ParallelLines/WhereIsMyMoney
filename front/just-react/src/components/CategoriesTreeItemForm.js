import { useState, useRef, useEffect } from 'react'

export default function CategoriesTreeItemForm({ categoryData, onSubmit, onCancel }) {
    const [category, setCategory] = useState(categoryData ? categoryData : {
        name: '',
        color: '',
        parent_id: null,
        level: '1'
    })
    // we need this because the initial click on a '+' button in a parent 
    // CategoryTree or CategoryTreeItem is also counts as an outside click -__-
    // so now the event listener with the help of this variable ignores the first click
    const ignoreFirstClick = useRef(false)
    const vanishingRef = useRef(null)

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

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (vanishingRef.current && ignoreFirstClick.current && !vanishingRef.current.contains(e.target)) {
                handleCancel(e)
            } else {
                ignoreFirstClick.current = true
            }
        }
        document.addEventListener('click', handleOutsideClick, false)
        return () => {
            document.removeEventListener('click', handleOutsideClick, false)
        }
    }, [])

    return (
        <form className="inline-form" onSubmit={handleSubmit} ref={vanishingRef}>
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
    )
}