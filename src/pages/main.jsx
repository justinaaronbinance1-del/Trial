import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'



import LandingPage from "./landing-page.jsx"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)
