import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Round from './pages/Round'

const router = createBrowserRouter([
  { path:'/', element:<App/>, children:[
    { index:true, element:<Home/> },
    { path:'g/:code', element:<Lobby/> },
    { path:'g/:code/r/:n', element:<Round/> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)
