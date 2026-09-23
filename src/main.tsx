import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root')!
const initialContent = JSON.parse(document.getElementById('initial-content')?.textContent || '{}')
const application = (
  <React.StrictMode>
    <App initialContent={initialContent} />
  </React.StrictMode>
)
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, application)
else ReactDOM.createRoot(root).render(application)
