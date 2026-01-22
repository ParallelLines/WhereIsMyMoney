import { useState } from 'react'
import CategoriesList from './CategoriesList'
import ExpensesList from './ExpensesList'
import LogOut from './LogOut'
import PieChart from './PieChart'
import RegularExpensesList from './RegularExpensesList'
import { useMediaQuery } from 'react-responsive'
import Menu from './Menu'

export default function MainScreen() {
    const isFullScreen = useMediaQuery({ query: '(min-width: 1400px)' })
    const isSmallScreen = useMediaQuery({ query: '(max-width: 565px)' })
    const [screenName, setScreenName] = useState('expenses')
    const pieChartWidth = isSmallScreen ? 230 : 320
    const pieChartHeight = isSmallScreen ? 230 : 320
    const menuItems = [
        {
            name: 'regulars',
            text: 'Recurrent Expenses',
        },
        {
            name: 'expenses',
            text: 'Expenses',
        },
        {
            name: 'categories',
            text: 'Categories',
        },
    ]
    return (
        <div className='grid-container'>
            {isFullScreen && <LogOut />}
            {!isFullScreen && <Menu
                menuItems={menuItems}
                onSelect={(name) => setScreenName(name)}
                selectedItem={screenName}
            />}

            {(isFullScreen || screenName === 'regulars') && <RegularExpensesList />}

            {(isFullScreen || screenName === 'expenses') && <ExpensesList />}

            {(isFullScreen || screenName === 'categories') && <PieChart width={pieChartWidth} height={pieChartHeight} />}
            {(isFullScreen || screenName === 'categories') && <CategoriesList />}
        </div>
    )
}