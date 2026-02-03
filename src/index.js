/** @format */

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import axios from 'axios'

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
axios.defaults.baseURL = backendUrl.endsWith('/') ? backendUrl : `${backendUrl}/`

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
