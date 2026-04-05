// src/App.jsx
// Root component - sets up all routes and theme management

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import CalorieCalculator from './pages/CalorieCalculator'
import BMICalculator from './pages/BMICalculator'
import AnatomyMap from './pages/AnatomyMap'
import GymLocator from './pages/GymLocator'
import Shop from './pages/Shop'
import AIPlanner from './pages/AIPlanner'

// Components
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { isAuthenticated, user, logout, saveAuth, updateUser } = useAuth()

  // ─── THEME MANAGEMENT ────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Apply dark class to <html> element whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <BrowserRouter>
      {/* Show navbar only when logged in */}
      {isAuthenticated && (
        <Navbar
          user={user}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onLogout={logout}
        />
      )}

      <main className={isAuthenticated ? 'pt-16' : ''}> {/* Offset for navbar height */}
        <Routes>
          {/* Public routes - redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={saveAuth} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onRegister={saveAuth} />}
          />

          {/* Protected routes - redirect to login if not logged in */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            {/* After login, check if onboarding is done */}
            <Route
              path="/dashboard"
              element={
                user?.onboardingComplete
                  ? <Dashboard user={user} isDark={isDark} />
                  : <Navigate to="/onboarding" />
              }
            />
            <Route
              path="/onboarding"
              element={<Onboarding onComplete={() => updateUser({ onboardingComplete: true })} />}
            />
            <Route path="/calories"  element={<CalorieCalculator />} />
            <Route path="/bmi"       element={<BMICalculator />} />
            <Route path="/anatomy"   element={<AnatomyMap />} />
            <Route path="/gyms"      element={<GymLocator />} />
            <Route path="/shop"      element={<Shop />} />
            <Route path="/ai"        element={<AIPlanner />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
