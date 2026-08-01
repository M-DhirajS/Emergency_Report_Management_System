import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "leaflet/dist/leaflet.css"
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </AuthProvider>
  </StrictMode>,
)
