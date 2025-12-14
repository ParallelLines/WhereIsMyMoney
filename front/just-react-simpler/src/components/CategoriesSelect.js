import { useFetchCategories, useMonitorErrors } from '../utils/reactQueryHooks'

export default function CategoriesSelect({ selectedCategoryId, onChange }) {
    const categoriesQuery = useFetchCategories()
    useMonitorErrors(categoriesQuery)
    return (
        <>
            {categoriesQuery.isPending && <div>Loading...</div>}
            <select name='category_id'
                aria-label='category of the regular expense'
                value={selectedCategoryId}
                onChange={(e) => {
                    const category = categoriesQuery.data?.find(cat => cat.id === e.target.value)
                    if (category) {
                        onChange(category)
                    }
                }}
                required
            >
                {categoriesQuery.data?.map(category =>
                    <option key={category.id} value={category.id}>
                        {category.path.length > 1 ? category.path.map(_ => '-') : ''}
                        {category.name}
                    </option>)
                }
            </select>
        </>
    )
}