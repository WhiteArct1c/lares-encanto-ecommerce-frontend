import React from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalStyle } from './theme/globalStyles.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle/>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
