import { useFetchCategoriesSuggestion } from '../utils/reactQueryHooks'
import SuggestionButton from './SuggestionButton'

export default function CategoriesSuggestion({ searchStr, onSelect }) {
    const categoriesSuggestionQuery = useFetchCategoriesSuggestion(searchStr)
    return (
        <div className='suggestions'>
            {categoriesSuggestionQuery.data?.map(category => (
                <SuggestionButton
                    key={category.category_id}
                    value={category.name}
                    color={category.color}
                    onClick={(e) => {
                        e.preventDefault()
                        onSelect({ ...category, id: category.category_id })
                    }}
                />
            ))}
        </div>
    )
}