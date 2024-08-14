import { useState } from 'react'
import { useCookies } from 'react-cookie'
import CategoriesTree from './components/CategoriesTree'
import Auth from './components/Auth'
import ExpensesList from './components/ExpensesList'
import PieChart from './components/PieChart'

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies()
  const [errors, setErrors] = useState([])
  const [category, setCategory] = useState(null)

  const authToken = cookies.budgetAuthToken
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <CategoriesTree onSelect={(id) => { setCategory(id) }} />
          <ExpensesList />
          <PieChart categoryId={category} />
        </>}
    </div>
  )
}