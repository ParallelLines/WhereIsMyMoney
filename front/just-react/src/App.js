import { useCookies } from 'react-cookie'
import CategoriesTree from './components/CategoriesTree'
import Auth from './components/Auth'
import ExpensesList from './components/ExpensesList'
import PieChart from './components/PieChart'
import LogOut from './components/LogOut'
import { useSelectedCategory } from './utils/CategoriesContext'

const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies()
  const { selectedCategory, setSelectedCategory } = useSelectedCategory()

  const authToken = cookies[COOKIE_AUTH_NAME]
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <div className="grid-container">
          <LogOut />
          <CategoriesTree />
          <ExpensesList />
          <PieChart categoryId={selectedCategory} />
        </div>}
    </div>
  )
}