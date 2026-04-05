// src/components/ProtectedRoute.jsx
// Wraps routes that require login
// If not authenticated → redirect to /login

import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ isAuthenticated }) {
  // <Outlet /> renders the child route if authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}


// src/components/StatCard.jsx
// Reusable dashboard stat card with icon, title, value, subtitle, and optional progress bar
// Export it here in the same file for simplicity

export function StatCard({ icon, title, value, subtitle, color = 'sky', progress = null }) {
  // Map color names to Tailwind classes
  const colorMap = {
    sky:    { bg: 'bg-sky-50 dark:bg-sky-900/20',    icon: 'text-sky-500',    bar: 'from-sky-400 to-sky-600'    },
    green:  { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'text-green-500',  bar: 'from-green-400 to-green-600' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20',icon:'text-orange-500', bar: 'from-orange-400 to-orange-600'},
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20',icon:'text-purple-500', bar: 'from-purple-400 to-purple-600'},
    rose:   { bg: 'bg-rose-50 dark:bg-rose-900/20',   icon: 'text-rose-500',   bar: 'from-rose-400 to-rose-600'   },
  }

  const c = colorMap[color] || colorMap.sky

  return (
    <div className="card fade-in">
      <div className="flex items-start justify-between mb-3">
        {/* Icon bubble */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
          <span className={`text-xl ${c.icon}`}>{icon}</span>
        </div>
        {subtitle && (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{subtitle}</span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>

      {/* Optional progress bar (e.g., for calories: eaten vs goal) */}
      {progress !== null && (
        <div className="mt-3">
          <div className="progress-bar">
            <div
              className={`progress-fill bg-gradient-to-r ${c.bar}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}% of goal</p>
        </div>
      )}
    </div>
  )
}
