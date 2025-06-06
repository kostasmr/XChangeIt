import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './UserContext'

import './index.css'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <UserProvider>
            <App />
        </UserProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
