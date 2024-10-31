import React from 'react'
import ReactDOM from 'react-dom/client'
import './reset.css'
import './index.css'
import App from './App'
import { ErrorBoundary } from 'react-error-boundary'
import Error from './components/Error'
import { CategoriesProvider } from './utils/CategoriesContext'
import { ExpensesProvider } from './utils/ExpensesContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error />}>
      <CategoriesProvider>
        <ExpensesProvider>
          <App />
        </ExpensesProvider>
      </CategoriesProvider>
    </ErrorBoundary>
  </React.StrictMode >
)
