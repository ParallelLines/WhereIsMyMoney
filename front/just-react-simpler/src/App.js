import CategoriesList from './components/CategoriesList'
import ExpensesList from './components/ExpensesList'
import Login from './components/Login'
import PieChart from './components/PieChart'
import RegularExpensesList from './components/RegularExpensesList'
import { useCookies } from 'react-cookie'


const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME


export default function App() {
  const [cookies] = useCookies()
  const authToken = cookies[COOKIE_AUTH_NAME]
  return (

    <div className="app">
      {!authToken && <Login />}
      {authToken &&
        <div className="grid-container">
          <RegularExpensesList />
          <ExpensesList />
          <CategoriesList />
          <PieChart />
        </div>}
    </div>

  )
}
