import { useState } from "react"
import CategoriesTree from "./components/CategoriesTree"
const URL = process.env.REACT_APP_BACKEND_URL

export default function App() {
  const [errors, setErrors] = useState([])

  return (
    <div className="App">
      <CategoriesTree />
    </div>
  )
}