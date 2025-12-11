import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// 🔑 CAMBIO CLAVE: Importar HashRouter en lugar de BrowserRouter
import { HashRouter } from 'react-router-dom'; 
import './index.css'
import AuthProvider from './hooks/useAuth';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 🔑 USAR HASHROUTER para compatibilidad con Electron (archivos locales) */}
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>
)