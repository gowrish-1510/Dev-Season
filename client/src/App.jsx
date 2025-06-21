import { useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Register from './pages/Register.jsx'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
  <AuthProvider>
  <Routes>
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<Register />}/>
    <Route path='/dashboard/:userid' element={<Dashboard />}/>
  </Routes> 
  </AuthProvider>  
  )
}

export default App
