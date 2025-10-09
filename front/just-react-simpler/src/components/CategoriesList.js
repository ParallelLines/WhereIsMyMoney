import Category from './Category'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../apiService/categories'

export default function CategoriesList() {
    const query = useQuery({ queryKey: ['categories'], queryFn: getCategories })

    return (
        <div className="categories-list">
            <div className="list-controls">
                <button>+</button>
            </div>
            <div className="list-column">
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.map(categorie => {
                    return (
                        <Category
                            data={categorie}
                            key={categorie.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}