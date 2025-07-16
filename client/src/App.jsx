import { useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Register from './pages/Register.jsx'
import Practice from './pages/Practice.jsx'
import Navbar from './components/navbar.jsx'
import Problem from './pages/Problem.jsx'
import ProblemSubmission from './pages/ProblemSubmission.jsx'
import ProblemSolve from './pages/ProblemSolve.jsx'
import Description from './components/Description.jsx'
import Submission from './components/Submission.jsx'
import Home from './pages/Home.jsx'
import Discussion from './components/Discussion.jsx'
import NotFound from './pages/NotFound.jsx'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Maintenance from './components/Maintenance.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/problems' element={<Problem />} />
        <Route path='/problems/submission' element={<ProblemSubmission />} />
        <Route path='/contests' element={<Maintenance />} />
        <Route path='/problems/:id' element={<ProblemSolve />}>
          <Route index element={<Description />} />
          <Route path='submission' element={<Submission />}/>
          <Route path='discussion' element={<Discussion/>}/>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
