import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes.jsx'
import { Toaster } from 'sonner';
import {Provider} from 'react-redux';
import Store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <Router>
        <AppRoutes />
        <Toaster visibleToasts={1} position="top-right" richColors />
      </Router>
    </Provider>
  </StrictMode>,
)
