// src/pages/BMICalculator.jsx
// Standalone BMI calculator with visual indicator

import { useState } from 'react'

// BMI categories with ranges and colors
const BMI_CATEGORIES = [
  { label: 'Underweight', range: '< 18.5',   color: 'text-blue-500',  bg: 'bg-blue-100 dark:bg-blue-900/30',  min: 0,    max: 18.49 },
  { label: 'Normal',      range: '18.5–24.9', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', min: 18.5, max: 24.9  },
  { label: 'Overweight',  range: '25–29.9',   color: 'text-yellow-500',bg: 'bg-yellow-100 dark:bg-yellow-900/30',min:25,  max: 29.9  },
  { label: 'Obese',       range: '≥ 30',      color: 'text-red-500',   bg: 'bg-red-100 dark:bg-red-900/30',    min: 30,   max: 100   },
]

// Health tips for each category
const TIPS = {
  Underweight: [
    'Increase caloric intake with nutrient-dense foods',
    'Focus on protein: eggs, chicken, legumes',
    'Do resistance training to build muscle mass',
    'Consult a doctor or nutritionist for guidance',
  ],
  Normal: [
    'Maintain your healthy lifestyle — great work!',
    'Keep up regular exercise 3-5x per week',
    'Focus on balanced nutrition with all macros',
    'Stay hydrated: 2-3 liters of water daily',
  ],
  Overweight: [
    'Create a moderate calorie deficit (300-500 kcal/day)',
    'Prioritize whole foods over processed ones',
    'Add cardio: walking, cycling, swimming',
    'Track your meals to stay accountable',
  ],
  Obese: [
    'Consult a healthcare provider for a safe plan',
    'Start with low-impact exercise (walking, swimming)',
    'Reduce sugar and processed food intake',
    'Set small, achievable weekly goals',
  ],
}

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState(null)

  const calculate = () => {
    const h = parseFloat(height) / 100 // cm → m
    const w = parseFloat(weight)
    if (!h || !w || h <= 0) return

    const result = w / (h * h)
    const rounded = Math.round(result * 10) / 10
    setBmi(rounded)

    // Find which category this BMI falls into
    const cat = BMI_CATEGORIES.find(c => rounded >= c.min && rounded <= c.max)
    setCategory(cat)
  }

  // Where the needle should point on the gauge (0-100%)
  const gaugePosition = bmi ? Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="section-title">📊 BMI Calculator</h1>
        <p className="section-subtitle">Calculate your Body Mass Index</p>
      </div>

      {/* Input Card */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Height (cm)</label>
            <input
              type="number" value={height} onChange={e => setHeight(e.target.value)}
              placeholder="e.g., 175" className="input" min="100" max="250"
            />
          </div>
          <div>
            <label className="label">Weight (kg)</label>
            <input
              type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="e.g., 70" className="input" min="20" max="300"
            />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary w-full">
          Calculate BMI
        </button>
      </div>

      {/* Result Card */}
      {bmi && category && (
        <div className="space-y-4 fade-in">

          {/* BMI Number */}
          <div className={`card text-center ${category.bg}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your BMI</p>
            <p className={`text-6xl font-bold ${category.color}`}>{bmi}</p>
            <p className={`text-xl font-semibold mt-2 ${category.color}`}>{category.label}</p>
            <p className="text-gray-500 text-sm mt-1">Normal range: 18.5 – 24.9</p>
          </div>

          {/* Visual Gauge */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">BMI Scale</h3>
            {/* Colored gradient bar */}
            <div className="relative h-6 rounded-full overflow-hidden mb-2"
              style={{ background: 'linear-gradient(to right, #60a5fa, #4ade80, #fbbf24, #f87171)' }}>
              {/* Needle marker */}
              {gaugePosition !== null && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-gray-900 dark:bg-white rounded-full transition-all duration-500"
                  style={{ left: `${gaugePosition}%`, transform: 'translateX(-50%)' }}
                />
              )}
            </div>
            {/* Labels under gauge */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>

            {/* Category legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {BMI_CATEGORIES.map(cat => (
                <div
                  key={cat.label}
                  className={`p-2 rounded-lg text-center text-xs ${cat.bg} ${category.label === cat.label ? 'ring-2 ring-gray-400' : ''}`}
                >
                  <p className={`font-semibold ${cat.color}`}>{cat.label}</p>
                  <p className="text-gray-500 dark:text-gray-400">{cat.range}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Health Tips */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">💡 Tips for You</h3>
            <ul className="space-y-2">
              {TIPS[category.label]?.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-sky-500 mt-0.5 shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal Weight Range */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">⚖️ Ideal Weight Range</h3>
            {height && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                For your height of <strong>{height}cm</strong>, a healthy weight is:{' '}
                <strong className="text-green-500">
                  {Math.round(18.5 * (height/100) ** 2)} kg – {Math.round(24.9 * (height/100) ** 2)} kg
                </strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
