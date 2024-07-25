import { useState } from 'react'
import { useCookies } from 'react-cookie'
import CategoriesTree from './components/CategoriesTree'
import Auth from './components/Auth'

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies()
  const [errors, setErrors] = useState([])

  const authToken = cookies.budgetAuthToken
  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <CategoriesTree />
        </>}
    </div>
  )
}