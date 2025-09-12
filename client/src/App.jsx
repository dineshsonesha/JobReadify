import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SkillGrowth from './pages/SkillGrowth'
import ResumeBuilder from './pages/ResumeBuilder'
import ReviewResume from './pages/ReviewResume'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import UpdateResume from './pages/UpdateResume'

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='enhance-resume' element={<UpdateResume />} />
          <Route path='skill-growth' element={<SkillGrowth />} />
          <Route path='resume-builder' element={<ResumeBuilder />} />
          <Route path='review-resume' element={<ReviewResume />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
