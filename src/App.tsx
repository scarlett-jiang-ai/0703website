import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import CursorTrail from './CursorTrail'
import Nav from './Nav'
import HomePage from './pages/HomePage'
import TechnologyPage from './pages/TechnologyPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div
        className="min-h-screen bg-black tracking-[-0.02em]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <CursorTrail />
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
