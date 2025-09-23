import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/container.css'
import '../styles/header-button.css'
import '../styles/header.css'
import '../styles/landing-page.css'
import '../styles/styles-for-all.css'


import LandingPage from "./landing-page.jsx"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)
