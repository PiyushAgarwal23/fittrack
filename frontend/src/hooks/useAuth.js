// src/hooks/useAuth.js
// Custom hook that manages authentication state across the app
// Any component can call useAuth() to get current user info and auth functions

import { useState, useEffect } from 'react'

export function useAuth() {
  // Initialize state from localStorage (persists across page refreshes)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  // isAuthenticated is true when we have both a user object and a token
  const isAuthenticated = !!(user && token)

  // Called after successful login or register
  const saveAuth = (authData) => {
    // authData = { token, name, email, onboardingComplete }
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify({
      name: authData.name,
      email: authData.email,
      onboardingComplete: authData.onboardingComplete
    }))
    setToken(authData.token)
    setUser({
      name: authData.name,
      email: authData.email,
      onboardingComplete: authData.onboardingComplete
    })
  }

  // Update user data without changing the token (e.g., after completing onboarding)
  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  // Called when user clicks logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return { user, token, isAuthenticated, saveAuth, updateUser, logout }
}
