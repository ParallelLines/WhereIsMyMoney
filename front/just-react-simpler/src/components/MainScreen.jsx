import { useState } from 'react'
import CategoriesList from './CategoriesList'
import ExpensesList from './ExpensesList'
import LogOut from './LogOut'
import RegularExpensesList from './RegularExpensesList'
import Menu from './Menu'
import PieChartScreen from './PieChartScreen'
import BarChartScreen from './BarChartScreen'
import NextMonthInfo from './NextMonthInfo'
import { useScreenSize } from '../utils/hooks'
import Tabs from './Tabs'

export default function MainScreen() {
    const screenSize = useScreenSize()
    const isSmallScreen = screenSize === 'small'
    const isBigScreen = screenSize === 'big'
    const [screenName, setScreenName] = useState('expenses')
    const pieChartWidth = isSmallScreen ? 260 : 350
    const pieChartHeight = isSmallScreen ? 260 : 350
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
            {(isBigScreen || screenName === 'regulars') && <NextMonthInfo />}
            {(isBigScreen || screenName === 'regulars') && <RegularExpensesList />}

            {(isBigScreen || screenName === 'expenses') && <BarChartScreen />}
            {(isBigScreen || screenName === 'expenses') && <ExpensesList />}

            {(isBigScreen || screenName === 'categories') && <PieChartScreen width={pieChartWidth} height={pieChartHeight} />}
            {(isBigScreen || screenName === 'categories') && <CategoriesList />}

            <LogOut />
            {isSmallScreen && <Tabs activeTab={screenName} onTabChange={setScreenName} />}
        </div>
    )
}