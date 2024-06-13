import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root, {
  loader as rootLoader
} from './routes/Root.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Dialog from './components/Dialog.jsx'
import ExpenseEdit, {
  loader as expenseEditLoader,
  action as expenseEditAction
} from './routes/ExpenseEdit.jsx'
import ExpenseCreate, {
  loader as expenseCreateLoader,
  action as expenseCreateAction
} from './routes/ExpensesCreate.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [{
      errorElement: <ErrorPage />,
      children: [
        {
          path: 'expenses/:id',
          element: <Dialog open><ExpenseEdit /></Dialog>,
          loader: expenseEditLoader,
          action: expenseEditAction
        },
        {
          path: 'expenses/new',
          element: <Dialog open><ExpenseCreate /></Dialog>,
          loader: expenseCreateLoader,
          action: expenseCreateAction
        }
      ]
    }]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
