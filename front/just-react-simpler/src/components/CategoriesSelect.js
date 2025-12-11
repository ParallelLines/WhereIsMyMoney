import { useFetchCategories, useMonitorErrors } from '../utils/reactQueryHooks'

export default function CategoriesSelect({ defaultValue, onChange }) {
    const categoriesQuery = useFetchCategories()
    useMonitorErrors(categoriesQuery)
    return (
        <>
            {categoriesQuery.isPending && <div>Loading...</div>}
            <select name='category_id'
                aria-label='category of the regular expense'
                defaultValue={defaultValue}
                onChange={onChange}
                required
            >
                {
                    categoriesQuery.data?.map(category =>
                        <option key={category.id} value={category.id}>
                            {category.path.length > 1 ? category.path.map(_ => '-') : ''}
                            {category.name}
                        </option>)
                }
            </select>

        </>
    )
}