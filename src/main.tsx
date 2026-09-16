import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Docs from './docs'
import './index.css'

const isDocsRoute = window.location.pathname === '/docs' || window.location.pathname.startsWith('/docs/')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isDocsRoute ? <Docs /> : <App />}
  </React.StrictMode>,
)
