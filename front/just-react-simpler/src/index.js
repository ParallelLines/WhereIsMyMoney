import React from 'react'
import ReactDOM from 'react-dom/client'
import './reset.css'
import './index.css'
import App from './App'
import { CookiesProvider } from 'react-cookie'
import { ErrorBoundary } from 'react-error-boundary'
import Error from './components/Error'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppContext } from './utils/AppContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error />}>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <AppContext>
            <App />
          </AppContext>
        </QueryClientProvider >
      </CookiesProvider>
    </ErrorBoundary>
  </React.StrictMode >
)
