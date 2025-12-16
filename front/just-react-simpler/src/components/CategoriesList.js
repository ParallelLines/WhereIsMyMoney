import Category from './Category'
import { useFetchCategories } from '../utils/reactQueryHooks'
import { useState } from 'react'
import CategoryForm from './CategoryForm'

export default function CategoriesList() {
    const [createMode, setCreateMode] = useState(false)

    const query = useFetchCategories()

    return (
        <div className='categories-list'>
            <div className='list-controls'>
                <button onClick={() => setCreateMode(true)}>+</button>
            </div>
            <div className='list-column'>
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