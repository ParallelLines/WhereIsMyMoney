import CategoriesList from "./components/CategoriesList"
import ExpensesList from "./components/ExpensesList"
import RegularExpensesList from "./components/RegularExpensesList"

export default function App() {
  return (
    <div className="app">
      <div className="grid-container">
        <RegularExpensesList />
        <ExpensesList />
        <CategoriesList />
      </div>
    </div>
  )
}
