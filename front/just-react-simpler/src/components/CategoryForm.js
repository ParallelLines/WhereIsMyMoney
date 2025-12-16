import { useState } from 'react'
import { useCreateCategory, useEditCategory } from '../utils/reactQueryHooks'
import { useErrorQueue } from '../utils/AppContext'
import VanishingBlock from './VanishingBlock'
import PopoverPicker from './PopoverPicker'

export default function CategoryForm({ categoryData, parentId, level, onCancel, onSubmit }) {
    const create = useCreateCategory()
    const edit = useEditCategory()
    const { addError } = useErrorQueue()

    const [category, setCategory] = useState(categoryData ? categoryData : {
        name: '',
        parent_id: parentId,
        color: 'ffabd5',
        level: level
    })

    const handleChange = (e) => {
        setCategory(currCategory => {
            return {
                ...currCategory,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleColorChange = (color) => {
        setCategory(currCategory => {
            return {
                ...currCategory,
                color: color.slice(1)
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('category at submit: ', category)
        try {
            if (!categoryData) {
                await create.mutateAsync(category)
            } else {
                await edit.mutateAsync(category)
            }
            onSubmit()
        } catch (error) {
            if (error.response) {
                addError('Fail: ' + error.response.data)
            } else {
                addError('Fail: ' + error.message)
            }
        }
    }

    return (
        <VanishingBlock
            anchorClassName={`list-item category level-${category.level}`}
            containerClassName='category-form-container'
            onClose={onCancel}
        >
            <form className='inline-form' onSubmit={handleSubmit}>
                <input name='name'
                    className='standart-input'
                    aria-label='name of the category'
                    value={category.name}
                    onChange={handleChange}
                    placeholder='name'
                    autoFocus
                    required
                />
                <PopoverPicker color={category.color} onChange={handleColorChange} />
                <div className='btns'>
                    <button className='positive' type='submit' disabled={create.isPending || edit.isPending}>
                        {categoryData ? 'Save' : 'Create'}
                    </button>
                    <button className='negative' onClick={onCancel} disabled={create.isPending || edit.isPending}>
                        Cancel
                    </button>
                </div>
            </form>

        </VanishingBlock>
    )
}