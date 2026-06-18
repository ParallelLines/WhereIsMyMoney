import IconCategories from './icons/IconCategories'
import IconExpenses from './icons/IconExpenses'
import IconRegulars from './icons/IconRegulars'

export default function Tabs({ activeTab, onTabChange }) {
    return (
        <div className='tabs'>
            <button
                className={`tab-btn icon-btn ${activeTab === 'regulars' ? '' : 'dull'}`}
                onClick={() => onTabChange('regulars')}
            >
                <IconRegulars />
            </button>
            <button
                className={`tab-btn icon-btn ${activeTab === 'expenses' ? '' : 'dull'}`}
                onClick={() => onTabChange('expenses')}
            >
                <IconExpenses />
            </button>
            <button
                className={`tab-btn icon-btn ${activeTab === 'categories' ? '' : 'dull'}`}
                onClick={() => onTabChange('categories')}
            >
                <IconCategories />
            </button>
        </div>
    )
}