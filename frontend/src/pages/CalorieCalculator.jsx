// src/pages/CalorieCalculator.jsx
// Log food entries and see today's macro breakdown

import { useState, useEffect } from 'react'
import { addFoodEntry, getTodayFood, deleteFoodEntry } from '../services/api'
import { Trash2, Plus } from 'lucide-react'

// Common foods for quick-add buttons
const QUICK_FOODS = [
  { foodName: 'Banana',         calories: 89,  proteinG: 1.1, carbsG: 23,  fatG: 0.3 },
  { foodName: 'Boiled Egg',     calories: 78,  proteinG: 6,   carbsG: 0.6, fatG: 5   },
  { foodName: 'Chicken Breast', calories: 165, proteinG: 31,  carbsG: 0,   fatG: 3.6 },
  { foodName: 'Brown Rice',     calories: 216, proteinG: 5,   carbsG: 45,  fatG: 1.8 },
  { foodName: 'Oats (100g)',    calories: 389, proteinG: 17,  carbsG: 66,  fatG: 7   },
  { foodName: 'Milk (250ml)',   calories: 122, proteinG: 8.1, carbsG: 12,  fatG: 4.8 },
]

export default function CalorieCalculator() {
  // Form state
  const [form, setForm] = useState({
    foodName: '', calories: '', proteinG: '', carbsG: '', fatG: '', quantity: 1
  })
  const [todayData, setTodayData] = useState(null) // Today's food log + totals
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Load today's food log on page open
  useEffect(() => {
    loadTodayFood()
  }, [])

  const loadTodayFood = async () => {
    try {
      const data = await getTodayFood()
      setTodayData(data)
    } catch (err) {
      console.error('Failed to load food log', err)
    }
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Quick-add a preset food
  const quickAdd = (food) => {
    setForm({ ...food, quantity: 1 })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addFoodEntry({
        ...form,
        calories: Number(form.calories),
        proteinG: Number(form.proteinG),
        carbsG: Number(form.carbsG),
        fatG: Number(form.fatG),
        quantity: Number(form.quantity)
      })
      setMessage('✅ Food logged! +5 points')
      setForm({ foodName: '', calories: '', proteinG: '', carbsG: '', fatG: '', quantity: 1 })
      await loadTodayFood() // Refresh the list
      setTimeout(() => setMessage(''), 3000) // Clear message after 3s
    } catch (err) {
      setMessage('❌ Failed to log food')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteFoodEntry(id)
      await loadTodayFood()
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  // Macro circle component (shows percent of total)
  const MacroBar = ({ label, value, total, color }) => {
    const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
    return (
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{Math.round(value)}g</span>
        </div>
        <div className="progress-bar">
          <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  const totals = todayData || { calories: 0, protein: 0, carbs: 0, fat: 0, entries: [] }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">🔥 Calorie Tracker</h1>
        <p className="section-subtitle">Log your meals and track macros</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── LEFT: Add Food ── */}
        <div className="space-y-4">

          {/* Quick add buttons */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">⚡ Quick Add</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_FOODS.map(food => (
                <button
                  key={food.foodName}
                  onClick={() => quickAdd(food)}
                  className="text-xs px-3 py-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  {food.foodName}
                </button>
              ))}
            </div>
          </div>

          {/* Manual input form */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">➕ Add Food</h3>

            {message && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg text-sm mb-3">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Food Name</label>
                <input name="foodName" value={form.foodName} onChange={handleChange}
                  placeholder="e.g., Chicken Breast" className="input" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Calories</label>
                  <input name="calories" type="number" value={form.calories} onChange={handleChange}
                    placeholder="kcal" className="input" required min="0" />
                </div>
                <div>
                  <label className="label">Quantity</label>
                  <input name="quantity" type="number" value={form.quantity} onChange={handleChange}
                    className="input" min="0.1" step="0.1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label">Protein (g)</label>
                  <input name="proteinG" type="number" value={form.proteinG} onChange={handleChange}
                    placeholder="0" className="input" min="0" />
                </div>
                <div>
                  <label className="label">Carbs (g)</label>
                  <input name="carbsG" type="number" value={form.carbsG} onChange={handleChange}
                    placeholder="0" className="input" min="0" />
                </div>
                <div>
                  <label className="label">Fat (g)</label>
                  <input name="fatG" type="number" value={form.fatG} onChange={handleChange}
                    placeholder="0" className="input" min="0" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                <Plus size={18} />
                {loading ? 'Logging...' : 'Log Food'}
              </button>
            </form>
          </div>
        </div>

        {/* ── RIGHT: Today's Summary ── */}
        <div className="space-y-4">
          {/* Totals card */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">📊 Today's Summary</h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-sky-500">{Math.round(totals.calories)}</p>
              <p className="text-gray-400 text-sm">total calories today</p>
            </div>
            <div className="space-y-3">
              <MacroBar label="Protein" value={totals.protein} total={150} color="bg-blue-500" />
              <MacroBar label="Carbs"   value={totals.carbs}   total={250} color="bg-yellow-500" />
              <MacroBar label="Fat"     value={totals.fat}     total={80}  color="bg-red-400" />
            </div>
          </div>

          {/* Food entries list */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">🍽️ Today's Meals</h3>
            {totals.entries?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No food logged yet today</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {totals.entries?.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.foodName}</p>
                      <p className="text-xs text-gray-400">
                        {Math.round(entry.calories * entry.quantity)} kcal
                        {entry.quantity !== 1 && ` × ${entry.quantity}`}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(entry.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
