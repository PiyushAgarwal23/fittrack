// src/pages/Register.jsx
// Registration form

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../services/api'
import { Eye, EyeOff, Dumbbell } from 'lucide-react'

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password
      })
      onRegister(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-950 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 rounded-2xl mb-4 shadow-lg">
            <Dumbbell size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Start your journey</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create your free FitTrack account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input"
                required
              />
            </div>

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

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                className="input"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-500 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
