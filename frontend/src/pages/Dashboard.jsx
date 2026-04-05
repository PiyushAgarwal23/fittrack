// src/pages/Dashboard.jsx
// The main dashboard - shows all fitness stats at a glance

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../services/api'
import { StatCard } from '../components/ProtectedRoute'
import { Flame, Dumbbell, Bot, MapPin, ShoppingBag, Trophy, Zap } from 'lucide-react'

// Reward milestones - what user unlocks at each point level
const REWARDS = [
  { points: 50,  label: '🎽 Custom Avatar Frame', unlocked: false },
  { points: 100, label: '🏆 Bronze Badge',         unlocked: false },
  { points: 250, label: '⚡ Streak Multiplier 2x', unlocked: false },
  { points: 500, label: '🌟 Gold Status',           unlocked: false },
]

export default function Dashboard({ user }) {
  const [data, setData] = useState(null)    // Dashboard API data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboard()
        setData(result)
      } catch (err) {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, []) // Empty array = runs once when component mounts

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🏋️</div>
          <p className="text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Calculate calorie progress percentage
  const calorieProgress = data?.calorieGoal > 0
    ? (data.todayCalories / data.calorieGoal) * 100
    : 0

  // Figure out which rewards are unlocked
  const rewardsWithStatus = REWARDS.map(r => ({
    ...r,
    unlocked: (data?.totalPoints ?? 0) >= r.points
  }))

  // Next milestone to unlock
  const nextReward = rewardsWithStatus.find(r => !r.unlocked)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── HEADER ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          👋 Hey, {data?.userName?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {data?.currentStreak > 0
            ? `🔥 ${data.currentStreak}-day streak! Keep it up!`
            : "Start today to build your streak!"
          }
        </p>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Calories */}
        <StatCard
          icon="🔥"
          title="Today's Calories"
          value={`${Math.round(data?.todayCalories ?? 0)} kcal`}
          subtitle={`Goal: ${data?.calorieGoal ?? 0}`}
          color="orange"
          progress={calorieProgress}
        />

        {/* Workout */}
        <StatCard
          icon="💪"
          title="Workout Today"
          value={data?.todayWorkoutMinutes > 0 ? `${data.todayWorkoutMinutes} min` : 'Rest Day'}
          subtitle={data?.goal?.replace('_', ' ')}
          color="green"
        />

        {/* BMI */}
        <StatCard
          icon="📊"
          title="Your BMI"
          value={data?.bmiValue > 0 ? data.bmiValue.toFixed(1) : '—'}
          subtitle={data?.bmiCategory}
          color={
            data?.bmiCategory === 'Normal' ? 'green' :
            data?.bmiCategory === 'Underweight' ? 'sky' : 'rose'
          }
        />

        {/* Points */}
        <StatCard
          icon="⭐"
          title="Reward Points"
          value={data?.totalPoints ?? 0}
          subtitle={nextReward ? `${nextReward.points - (data?.totalPoints ?? 0)} pts to next` : '🏆 Max level!'}
          color="purple"
          progress={nextReward ? ((data?.totalPoints ?? 0) / nextReward.points) * 100 : 100}
        />
      </div>

      {/* ── GAMIFICATION SECTION ── */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-500" size={22} />
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Rewards & Milestones</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rewardsWithStatus.map((reward) => (
            <div
              key={reward.points}
              className={`p-3 rounded-xl border-2 text-center transition-all
                ${reward.unlocked
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700 opacity-50'
                }`}
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{reward.label}</p>
              <p className="text-xs text-gray-400 mt-1">{reward.points} pts</p>
              <p className="text-xs mt-1">{reward.unlocked ? '✅ Unlocked' : '🔒 Locked'}</p>
            </div>
          ))}
        </div>

        {/* Streak display */}
        <div className="mt-4 flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{data?.currentStreak ?? 0}-Day Streak</p>
            <p className="text-xs text-gray-500">
              Log food or workout daily to keep it going! +10 pts per day
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold text-orange-500">{data?.currentStreak ?? 0}</p>
            <p className="text-xs text-gray-400">days</p>
          </div>
        </div>
      </div>

      {/* ── QUICK LINKS GRID ── */}
      <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { to: '/calories', icon: Flame,       emoji: '🔥', label: 'Log Food',     desc: 'Track what you eat',     color: 'from-orange-400 to-red-500'   },
          { to: '/anatomy',  icon: Dumbbell,    emoji: '💪', label: 'Anatomy Map',  desc: 'Explore muscle groups',  color: 'from-sky-400 to-blue-600'     },
          { to: '/ai',       icon: Bot,         emoji: '🤖', label: 'AI Planner',   desc: 'Get personalized plans', color: 'from-purple-400 to-pink-500'  },
          { to: '/bmi',      icon: Zap,         emoji: '📊', label: 'BMI Check',    desc: 'Calculate your BMI',     color: 'from-green-400 to-teal-500'   },
          { to: '/gyms',     icon: MapPin,      emoji: '🗺️', label: 'Find Gyms',    desc: 'Gyms near you',          color: 'from-yellow-400 to-orange-500'},
          { to: '/shop',     icon: ShoppingBag, emoji: '🛍️', label: 'Shop',         desc: 'Fitness gear & supps',   color: 'from-pink-400 to-rose-500'    },
        ].map(({ to, emoji, label, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
          >
            {/* Gradient icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
              {emoji}
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
