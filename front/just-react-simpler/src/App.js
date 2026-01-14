import ErrorQueue from './components/ErrorQueue'
import Login from './components/Login'
import MainScreen from './components/MainScreen'
import { useCookies } from 'react-cookie'


const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function App() {
  const [cookies] = useCookies()
  const authToken = cookies[COOKIE_AUTH_NAME]
  return (
    <div className='app'>
      <ErrorQueue />
      {!authToken && <Login />}
      {authToken && <MainScreen />}
    </div>
  )
}
