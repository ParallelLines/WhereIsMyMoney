import Category from './Category'
import { useFetchCategories } from '../utils/reactQueryHooks'
import { useRef, useState } from 'react'
import CategoryForm from './CategoryForm'

export default function CategoriesList() {
    const [createMode, setCreateMode] = useState(false)
    const listToScroll = useRef(null)

    const handleCreate = () => {
        if (listToScroll.current) {
            listToScroll.current.scrollTop = 0
        }
        setCreateMode(true)
    }

    const query = useFetchCategories()

    return (
        <div className='categories-list'>
            <div className='list-ctrls'>
                <button onClick={handleCreate}>+</button>
            </div>
            <div className='list-column' ref={listToScroll}>
                {createMode &&
                    <CategoryForm
                        level="1"
                        onCancel={() => setCreateMode(false)}
                        onSubmit={() => setCreateMode(false)}
                    />
                }
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.map(categorie => {
                    return (
                        <Category
                            categoryData={categorie}
                            key={categorie.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}