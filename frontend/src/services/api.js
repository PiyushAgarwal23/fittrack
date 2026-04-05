// src/services/api.js
// All backend API calls go through this file
// This keeps our components clean - they just call these functions

import axios from 'axios'

// Base URL: reads from .env file (VITE_API_URL=http://localhost:5000)
// Falls back to same-origin (for when frontend and backend are on same server)
const BASE_URL = import.meta.env.VITE_API_URL || ''

// Create axios instance with default config
const api = axios.create({
  baseURL: "https://localhost:5000", // ✅ FIX
  headers: { 'Content-Type': 'application/json' },
})

// ── REQUEST INTERCEPTOR ───────────────────────────────────────────────────────
// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // "Bearer <token>"
  }
  return config
})

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
// Handle 401 errors globally (token expired → send to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login' // Redirect to login page
    }
    return Promise.reject(error)
  }
)

// ── AUTH ─────────────────────────────────────────────────────────────────────

export const register = (data) =>
  api.post('/api/auth/register', data).then((r) => r.data)

export const login = (data) =>
  api.post('/api/auth/login', data).then((r) => r.data)

// ── DASHBOARD & PROFILE ──────────────────────────────────────────────────────

export const getDashboard = () =>
  api.get('/api/dashboard').then((r) => r.data)

export const setupProfile = (data) =>
  api.post('/api/profile/setup', data).then((r) => r.data)

export const getProfile = () =>
  api.get('/api/profile').then((r) => r.data)

// ── CALORIES ─────────────────────────────────────────────────────────────────

export const addFoodEntry = (data) =>
  api.post('/api/calorie/add', data).then((r) => r.data)

export const getTodayFood = () =>
  api.get('/api/calorie/today').then((r) => r.data)

export const deleteFoodEntry = (id) =>
  api.delete(`/api/calorie/${id}`).then((r) => r.data)

// ── WORKOUTS ─────────────────────────────────────────────────────────────────

export const addWorkoutEntry = (data) =>
  api.post('/api/workout/add', data).then((r) => r.data)

export const getWorkoutHistory = () =>
  api.get('/api/workout/history').then((r) => r.data)

// ── AI ────────────────────────────────────────────────────────────────────────

export const getAIDietPlan = () =>
  api.post('/api/ai/diet-plan').then((r) => r.data)

export const getAIWorkoutPlan = () =>
  api.post('/api/ai/workout-plan').then((r) => r.data)

export const chatWithAI = (message) =>
  api.post('/api/ai/chat', { message }).then((r) => r.data)

export default api
