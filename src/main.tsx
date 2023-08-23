import React from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalStyle } from './theme/globalStyles.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes.tsx'
import { AuthProvider } from './contexts/Auth/AuthProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle/>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
