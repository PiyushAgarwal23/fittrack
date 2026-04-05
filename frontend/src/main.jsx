// src/main.jsx
// App entry point — renders our React app into index.html's <div id="root">

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apply dark mode before render to avoid flash of wrong theme
const savedTheme = localStorage.getItem('theme')
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
