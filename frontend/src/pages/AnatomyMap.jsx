// src/pages/AnatomyMap.jsx
// Clickable human anatomy with exercises per muscle group

import { useState } from 'react'

// Muscle groups data - exercises, pros, cons, tips
const MUSCLES = {
  chest: {
    name: '💪 Chest (Pectorals)',
    emoji: '💪',
    exercises: ['Bench Press', 'Push-Ups', 'Dumbbell Flyes', 'Cable Crossovers', 'Incline Press'],
    pros: ['Improves posture', 'Increases pushing strength', 'Enhances upper body shape'],
    cons: ['Overtraining causes shoulder strain', 'Easy to overwork vs back muscles'],
    tips: ['Always stretch before pressing', 'Squeeze at the top of each rep', 'Balance with back exercises'],
    color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
  },
  back: {
    name: '🔙 Back (Lats & Rhomboids)',
    emoji: '🔙',
    exercises: ['Pull-Ups', 'Deadlifts', 'Bent-Over Rows', 'Lat Pulldowns', 'Seated Cable Rows'],
    pros: ['Prevents back pain', 'Improves posture', 'Core stability'],
    cons: ['Deadlifts risk injury if form is poor', 'Complex movement patterns'],
    tips: ['Keep spine neutral during lifts', 'Drive elbows, not hands', 'Warm up rotator cuffs'],
    color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
  },
  shoulders: {
    name: '🏋️ Shoulders (Deltoids)',
    emoji: '🏋️',
    exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Arnold Press', 'Face Pulls'],
    pros: ['Broader appearance', 'Supports all upper body movements', 'Injury prevention'],
    cons: ['Small muscle - easy to strain', 'Requires careful warm-up'],
    tips: ['Start light, form is everything', 'Train all 3 heads (front, side, rear)', 'Avoid behind-neck pressing'],
    color: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'
  },
  arms: {
    name: '💥 Arms (Biceps & Triceps)',
    emoji: '💥',
    exercises: ['Barbell Curls', 'Hammer Curls', 'Tricep Dips', 'Skull Crushers', 'Cable Pushdowns'],
    pros: ['Aesthetic muscle gains', 'Supports compound movements'],
    cons: ['Isolation limits overall strength gains', 'Easy to neglect triceps'],
    tips: ['Triceps = 2/3 of arm size, train them!', 'Full range of motion matters most', 'Superset for efficiency'],
    color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'
  },
  core: {
    name: '⚡ Core (Abs & Obliques)',
    emoji: '⚡',
    exercises: ['Plank', 'Crunches', 'Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts'],
    pros: ['Protects spine', 'Improves all athletic performance', 'Aesthetic abs'],
    cons: ['Abs are made in the kitchen (diet matters most)', 'Crunches can strain neck'],
    tips: ['Train core 3-4x per week', 'Plank is better than crunches for spine', 'Diet is key to visible abs'],
    color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
  },
  legs: {
    name: '🦵 Legs (Quads, Hamstrings, Glutes)',
    emoji: '🦵',
    exercises: ['Squats', 'Leg Press', 'Romanian Deadlift', 'Lunges', 'Calf Raises'],
    pros: ['Biggest muscle group → most calories burned', 'Releases most testosterone', 'Functional strength'],
    cons: ['Most intense training session', 'DOMS (soreness) can be severe'],
    tips: ['Never skip leg day!', 'Keep knees tracking over toes in squats', 'Deep squat = more glute activation'],
    color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
  },
  calves: {
    name: '🦶 Calves (Gastrocnemius)',
    emoji: '🦶',
    exercises: ['Standing Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises', 'Jump Rope'],
    pros: ['Improves running performance', 'Injury prevention for ankles'],
    cons: ['Stubborn muscle - slow to grow', 'Often neglected'],
    tips: ['Train calves daily if they\'re lagging', 'Full stretch at bottom is crucial', 'High reps work well (15-25)'],
    color: 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700'
  },
  glutes: {
    name: '🍑 Glutes (Gluteus Maximus)',
    emoji: '🍑',
    exercises: ['Hip Thrusts', 'Glute Bridges', 'Bulgarian Split Squat', 'Kickbacks', 'Step-Ups'],
    pros: ['Strongest muscle in the body', 'Protects lower back', 'Improves sprinting speed'],
    cons: ['Underactivated in most people (sitting too much)', 'Hip thrusts can be awkward to setup'],
    tips: ['Squeeze at the top of every rep', 'Activate before heavy lifts', 'Hip thrusts > squats for glute growth'],
    color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700'
  }
}

export default function AnatomyMap() {
  const [selected, setSelected] = useState(null) // Currently selected muscle
  const [activeTab, setActiveTab] = useState('exercises') // Info tab

  const muscle = selected ? MUSCLES[selected] : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="section-title">🫀 Human Anatomy Explorer</h1>
        <p className="section-subtitle">Click a muscle group to learn exercises and tips</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── LEFT: Body diagram (SVG-based clickable buttons) ── */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Select a Muscle Group
          </h3>

          {/* Simple visual body representation with clickable zones */}
          <div className="relative mx-auto" style={{ maxWidth: 280 }}>
            {/* Body SVG outline */}
            <svg viewBox="0 0 200 400" className="w-full opacity-20 dark:opacity-10 absolute inset-0 pointer-events-none">
              {/* Simple stick figure body */}
              <ellipse cx="100" cy="30"  rx="22" ry="25" fill="#666" /> {/* Head */}
              <rect   x="70"  y="60"  width="60" height="100" rx="10" fill="#666" /> {/* Torso */}
              <rect   x="40"  y="65"  width="25" height="80"  rx="8"  fill="#666" /> {/* Left arm */}
              <rect   x="135" y="65"  width="25" height="80"  rx="8"  fill="#666" /> {/* Right arm */}
              <rect   x="72"  y="155" width="25" height="100" rx="8"  fill="#666" /> {/* Left leg */}
              <rect   x="103" y="155" width="25" height="100" rx="8"  fill="#666" /> {/* Right leg */}
              <rect   x="72"  y="245" width="25" height="40"  rx="5"  fill="#666" /> {/* Left calf */}
              <rect   x="103" y="245" width="25" height="40"  rx="5"  fill="#666" /> {/* Right calf */}
            </svg>

            {/* Clickable muscle zone buttons laid over body */}
            <div className="relative" style={{ paddingTop: '200%' }}>
              {[
                { key: 'shoulders', label: '🏋️ Shoulders', style: { top: '15%', left: '50%', transform: 'translateX(-50%)', width: '85%' } },
                { key: 'chest',     label: '💪 Chest',     style: { top: '24%', left: '50%', transform: 'translateX(-50%)', width: '55%' } },
                { key: 'arms',      label: '💥 Arms',       style: { top: '28%', left: '50%', transform: 'translateX(-50%)', width: '85%' } },
                { key: 'core',      label: '⚡ Core',       style: { top: '38%', left: '50%', transform: 'translateX(-50%)', width: '55%' } },
                { key: 'back',      label: '🔙 Back',       style: { top: '31%', right: '-2%', width: '18%' } },
                { key: 'glutes',    label: '🍑 Glutes',     style: { top: '46%', left: '50%', transform: 'translateX(-50%)', width: '55%' } },
                { key: 'legs',      label: '🦵 Legs',       style: { top: '57%', left: '50%', transform: 'translateX(-50%)', width: '70%' } },
                { key: 'calves',    label: '🦶 Calves',     style: { top: '76%', left: '50%', transform: 'translateX(-50%)', width: '60%' } },
              ].map(({ key, label, style }) => (
                <button
                  key={key}
                  onClick={() => { setSelected(key); setActiveTab('exercises') }}
                  className={`absolute text-xs font-semibold px-2 py-1 rounded-lg border-2 transition-all
                    ${selected === key
                      ? MUSCLES[key].color + ' shadow-md scale-105'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-sky-400 text-gray-700 dark:text-gray-300'
                    }`}
                  style={style}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Info panel ── */}
        {muscle ? (
          <div className="card fade-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{muscle.name}</h2>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              {['exercises', 'pros', 'tips'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-sm font-medium py-1.5 rounded-lg capitalize transition-colors
                    ${activeTab === tab
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  {tab === 'exercises' ? '🏋️' : tab === 'pros' ? '✅' : '💡'} {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="space-y-2">
              {activeTab === 'exercises' && muscle.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sky-500 font-bold text-sm">{i + 1}.</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{ex}</span>
                </div>
              ))}

              {activeTab === 'pros' && (
                <>
                  <div className="mb-3">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-2 uppercase">Benefits ✅</p>
                    {muscle.pros.map((p, i) => (
                      <div key={i} className="flex gap-2 p-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-green-500">✓</span> {p}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-red-500 font-semibold mb-2 uppercase">Watch Out ⚠️</p>
                    {muscle.cons.map((c, i) => (
                      <div key={i} className="flex gap-2 p-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-red-400">!</span> {c}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'tips' && muscle.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-sky-500 shrink-0">💡</span> {tip}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-5xl mb-4">👈</p>
              <p className="font-medium">Select a muscle group</p>
              <p className="text-sm mt-1">to see exercises and tips</p>
            </div>
          </div>
        )}
      </div>

      {/* All muscle groups grid at bottom */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">All Muscle Groups</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {Object.entries(MUSCLES).map(([key, m]) => (
            <button
              key={key}
              onClick={() => { setSelected(key); setActiveTab('exercises') }}
              className={`p-2 rounded-xl border-2 text-center text-xs font-medium transition-all
                ${selected === key ? m.color : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-sky-300'}`}
            >
              <div className="text-xl mb-1">{m.emoji}</div>
              <div className="capitalize">{key}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
