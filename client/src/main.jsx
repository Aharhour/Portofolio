import { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'

// Getting the Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Throw an error if the key is missing so the app doesn't start without authentication
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Rendering the app into the root element with StrictMode, ClerkProvider for auth, and BrowserRouter for routing
ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
)
