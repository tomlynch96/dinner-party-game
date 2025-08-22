import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Round from './pages/Round'
import Results from './pages/Results'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },                  // <-- index route
      { path: 'g/:code', element: <Lobby /> },
      { path: 'g/:code/r/:n', element: <Round /> },
      { path: 'g/:code/results/:n', element: <Results /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
