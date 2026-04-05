// src/pages/Login.jsx
// Login form with email/password

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../services/api'
import { Eye, EyeOff, Dumbbell } from 'lucide-react'

export default function Login({ onLogin }) {
  // Form state
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Update a single field in the form
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent page refresh
    setLoading(true)
    setError('')

    try {
      const data = await login(form) // Call our API service
      onLogin(data)                  // Save token + user to localStorage
    } catch (err) {
      // Show the error message from backend
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 rounded-2xl mb-4 shadow-lg">
            <Dumbbell size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Login to continue your fitness journey</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            {/* Password with show/hide toggle */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-500 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
