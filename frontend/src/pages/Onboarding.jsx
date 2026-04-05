// src/pages/Onboarding.jsx
// Multi-step onboarding flow that collects user data
// Each "step" is one question screen with engaging UI

import { useState } from 'react'
import { setupProfile } from '../services/api'
import { ChevronRight, ChevronLeft } from 'lucide-react'

// ─── STEP DEFINITIONS ────────────────────────────────────────────────────────
// Each step has a title, emoji, component type, and field names

const STEPS = [
  {
    id: 'gender', emoji: '🧬', title: "What's your biological sex?",
    subtitle: 'Used for accurate BMI and calorie calculations',
    type: 'choice',
    options: [
      { label: '♂ Male',   value: 'male'   },
      { label: '♀ Female', value: 'female' }
    ]
  },
  {
    id: 'age', emoji: '🎂', title: "How old are you?",
    subtitle: 'Your age helps us personalize your plan',
    type: 'number', min: 10, max: 100, unit: 'years', field: 'age'
  },
  {
    id: 'height', emoji: '📏', title: "How tall are you?",
    subtitle: 'In centimeters (e.g., 175 for 5\'9")',
    type: 'number', min: 100, max: 250, unit: 'cm', field: 'heightCm'
  },
  {
    id: 'weight', emoji: '⚖️', title: "What's your current weight?",
    subtitle: 'Be honest — this is just for you!',
    type: 'number', min: 30, max: 300, unit: 'kg', field: 'weightKg'
  },
  {
    id: 'goal', emoji: '🎯', title: "What's your main goal?",
    subtitle: 'We\'ll tailor everything around this',
    type: 'choice',
    options: [
      { label: '🔥 Lose Fat',        value: 'fat_loss',    desc: 'Burn calories, slim down' },
      { label: '💪 Build Muscle',    value: 'muscle_gain', desc: 'Get stronger and bigger'  },
      { label: '⚖️ Stay in Shape',   value: 'maintenance', desc: 'Maintain current physique' }
    ]
  },
  {
    id: 'activity', emoji: '🏃', title: "How active are you?",
    subtitle: 'Be honest — we won\'t judge!',
    type: 'choice',
    options: [
      { label: '🛋️ Desk Warrior',        value: 'sedentary',   desc: 'Mostly sitting, little exercise' },
      { label: '🚶 Light Mover',          value: 'light',       desc: '1-3 days/week exercise'          },
      { label: '🚴 Regular Exerciser',    value: 'moderate',    desc: '3-5 days/week exercise'          },
      { label: '🏋️ Fitness Enthusiast',  value: 'active',      desc: '6-7 days/week hard exercise'     },
      { label: '🏆 Athlete Mode',         value: 'very_active', desc: 'Intense daily training'          }
    ]
  },
  {
    id: 'timeline', emoji: '📅', title: "How soon do you want results?",
    subtitle: 'This helps us pace your plan realistically',
    type: 'choice',
    options: [
      { label: '⚡ 4 Weeks',  value: 4,  desc: 'Fast but challenging' },
      { label: '💫 8 Weeks',  value: 8,  desc: 'Balanced approach'    },
      { label: '🌱 12 Weeks', value: 12, desc: 'Steady and sustainable'},
      { label: '🏆 6 Months', value: 24, desc: 'Long-term lifestyle change'}
    ]
  }
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)           // Current step index
  const [answers, setAnswers] = useState({})    // Collected answers
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1
  const progress = ((step) / STEPS.length) * 100

  // Save answer for current step
  const setAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: value }))
  }

  const currentAnswer = answers[currentStep.id]

  // Go to next step or submit
  const handleNext = async () => {
    if (!currentAnswer && currentAnswer !== 0) return // Require answer

    if (isLastStep) {
      await handleSubmit()
    } else {
      setStep(s => s + 1)
    }
  }

  // Submit all collected answers to backend
  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await setupProfile({
        heightCm:      answers.height,
        weightKg:      answers.weight,
        age:           answers.age,
        gender:        answers.gender,
        goal:          answers.goal,
        activityLevel: answers.activity,
        timelineWeeks: answers.timeline
      })
      onComplete() // Tell App.jsx onboarding is done → redirect to dashboard
    } catch (err) {
      setError('Failed to save profile. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">

        {/* Progress bar at top */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% done</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step Card */}
        <div className="card fade-in" key={step}> {/* key forces re-render animation on step change */}

          {/* Step emoji + title */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{currentStep.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentStep.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{currentStep.subtitle}</p>
          </div>

          {/* ── CHOICE INPUT ── */}
          {currentStep.type === 'choice' && (
            <div className="grid gap-3">
              {currentStep.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAnswer(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all
                    ${currentAnswer === opt.value
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                      : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <span className="font-semibold">{opt.label}</span>
                  {opt.desc && <span className="block text-xs text-gray-400 mt-0.5">{opt.desc}</span>}
                </button>
              ))}
            </div>
          )}

          {/* ── NUMBER INPUT ── */}
          {currentStep.type === 'number' && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                {/* Decrement button */}
                <button
                  onClick={() => setAnswer(Math.max(currentStep.min, (currentAnswer || currentStep.min) - 1))}
                  className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  −
                </button>

                {/* Number display / input */}
                <input
                  type="number"
                  value={currentAnswer || ''}
                  onChange={e => setAnswer(Number(e.target.value))}
                  min={currentStep.min}
                  max={currentStep.max}
                  className="w-28 text-center text-3xl font-bold border-b-2 border-sky-500 bg-transparent py-2 focus:outline-none text-gray-900 dark:text-white"
                  placeholder="—"
                />

                {/* Increment button */}
                <button
                  onClick={() => setAnswer(Math.min(currentStep.max, (currentAnswer || currentStep.min) + 1))}
                  className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">{currentStep.unit}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn-secondary flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={(!currentAnswer && currentAnswer !== 0) || loading}
              className="btn-primary flex-1 flex items-center justify-center gap-1"
            >
              {loading ? 'Saving...' : isLastStep ? '🚀 Let\'s Go!' : (
                <>Next <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>

        {/* Step dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300
                ${i === step ? 'w-6 bg-sky-500' : i < step ? 'w-2 bg-sky-300' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
