import Category from "./Category"

const categories = [
    { id: '14', name: 'undefined', color: 'a7a7a7', parent_id: null, level: '1' },
    { id: '15', name: 'living', color: '49bf04', parent_id: null, level: '1' },
    { id: '16', name: 'rent', color: 'e75050', parent_id: '15', level: '2' },
    { id: '17', name: 'bills', color: '9fbdfb', parent_id: '15', level: '2' },
    { id: '18', name: 'insurance', color: '6076fb', parent_id: '15', level: '2' },
    { id: '19', name: 'subscriptions', color: 'ffabd5', parent_id: null, level: '1' },
    { id: '20', name: 'household', color: 'ffd989', parent_id: null, level: '1' },
    { id: '21', name: 'clothing', color: 'a02fcb', parent_id: null, level: '1' },
    { id: '22', name: 'entertainment', color: 'fb52a6', parent_id: null, level: '1' },
    { id: '23', name: 'health & beauty', color: '0079ff', parent_id: null, level: '1' },
    { id: '24', name: 'hobby', color: 'd1ff42', parent_id: null, level: '1' },
    { id: '25', name: 'restaurants', color: 'c1003d', parent_id: null, level: '1' },
    { id: '26', name: 'food', color: 'ff7e00', parent_id: null, level: '1' },
    { id: '27', name: 'gifts', color: '18ffd2', parent_id: null, level: '1' }
]

export default function CategoriesList() {
    return (
        <div className="categories-list">
            {categories.map(categorie => {
                return (
                    <Category
                        data={categorie}
                        key={categorie.id}
                    />
                )
            })}
        </div>
    )
}