// src/components/Navbar.jsx
// Top navigation bar with links, user info, and theme toggle

import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Flame, Calculator, Dumbbell,
  MapPin, ShoppingBag, Bot, Sun, Moon, Menu, X, LogOut
} from 'lucide-react'

// Nav links config - easy to add/remove
const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calories',  icon: Flame,           label: 'Calories'  },
  { to: '/bmi',       icon: Calculator,      label: 'BMI'       },
  { to: '/anatomy',   icon: Dumbbell,        label: 'Anatomy'   },
  { to: '/gyms',      icon: MapPin,          label: 'Gyms'      },
  { to: '/shop',      icon: ShoppingBag,     label: 'Shop'      },
  { to: '/ai',        icon: Bot,             label: 'AI Planner'},
]

export default function Navbar({ user, isDark, onToggleTheme, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation() // to highlight current page link

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🏋️</span>
          <span className="font-bold text-xl gradient-text">FitTrack</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === to
                  ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: theme toggle + user + logout */}
        <div className="flex items-center gap-2">
          {/* Dark/Light mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User greeting (desktop) */}
          <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
            Hi, <strong>{user?.name?.split(' ')[0]}</strong>
          </span>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${location.pathname === to
                  ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
