import { useState } from 'react'
import { useCookies } from 'react-cookie'
import CategoriesTree from './components/CategoriesTree'
import Auth from './components/Auth'
import ExpensesList from './components/ExpensesList'
import PieChart from './components/PieChart'
import LogOut from './components/LogOut'
import { CategoriesProvider } from './components/CategoriesContext'

const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies()
  const [errors, setErrors] = useState([])
  const [category, setCategory] = useState(null)

  const authToken = cookies[COOKIE_AUTH_NAME]
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <div className="grid-container">
          <CategoriesProvider>
            <LogOut />
            <CategoriesTree onSelect={(id) => { setCategory(id) }} />
            <ExpensesList />
            <PieChart categoryId={category} />
          </CategoriesProvider>
        </div>}
    </div>
  )
}