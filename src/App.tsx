import './App.css'
import { Invoices } from './pages/Invoices'
import { createBrowserRouter, Navigate, RouterProvider, Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Invoice } from './pages/Invoice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'invoices',
        element: <Invoices />,
        children: [
          {
            path: ':id',
            element: <Invoice />
          }
        ]
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
])

function App() {

  return (
    <div className="m-2">
      <RouterProvider router={router} />
    </div>
  )
}

export default App

