// src/pages/AIPlanner.jsx
// AI-powered fitness planner using Claude API through our backend
// Shows diet plan, workout plan, and a simple chat interface

import { useState } from 'react'
import { getAIDietPlan, getAIWorkoutPlan, chatWithAI } from '../services/api'
import { Bot, Send, Loader, Utensils, Dumbbell, RefreshCw } from 'lucide-react'

export default function AIPlanner() {
  const [activeTab, setActiveTab] = useState('diet') // 'diet' | 'workout' | 'chat'

  // Diet plan state
  const [dietPlan, setDietPlan] = useState('')
  const [dietLoading, setDietLoading] = useState(false)

  // Workout plan state
  const [workoutPlan, setWorkoutPlan] = useState('')
  const [workoutLoading, setWorkoutLoading] = useState(false)

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your AI fitness coach 🤖 Ask me anything about fitness, nutrition, or your workout plan!" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Fetch diet plan from our backend (which calls Claude)
  const fetchDietPlan = async () => {
    setDietLoading(true)
    try {
      const result = await getAIDietPlan()
      setDietPlan(result.plan)
    } catch (err) {
      setDietPlan('Failed to generate plan. Please complete your profile first, then try again.')
    } finally {
      setDietLoading(false)
    }
  }

  // Fetch workout plan
  const fetchWorkoutPlan = async () => {
    setWorkoutLoading(true)
    try {
      const result = await getAIWorkoutPlan()
      setWorkoutPlan(result.plan)
    } catch (err) {
      setWorkoutPlan('Failed to generate plan. Please complete your profile first, then try again.')
    } finally {
      setWorkoutLoading(false)
    }
  }

  // Send chat message
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMsg = chatInput.trim()
    setChatInput('')

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setChatLoading(true)

    try {
      const result = await chatWithAI(userMsg)
      setMessages(prev => [...prev, { role: 'bot', text: result.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I had trouble connecting. Please try again! 🙏' }])
    } finally {
      setChatLoading(false)
    }
  }

  // Simple markdown-to-HTML converter for AI response formatting
  // (Turns **bold** → <strong>, # Heading → <h3>, - item → bullet)
  const renderText = (text) => {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />
      if (line.startsWith('# '))  return <h3 key={i} className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-1">{line.slice(2)}</h3>
      if (line.startsWith('## ')) return <h4 key={i} className="font-bold text-gray-800 dark:text-gray-200 mt-3 mb-1">{line.slice(3)}</h4>
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 my-0.5">
            <span className="text-sky-500 shrink-0">•</span>
            <span className="text-gray-700 dark:text-gray-300">{line.slice(2)}</span>
          </div>
        )
      }
      // Bold text: **text**
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className="text-gray-700 dark:text-gray-300 my-0.5">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-white">{part}</strong> : part
          )}
        </p>
      )
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">🤖 AI Fitness Planner</h1>
        <p className="section-subtitle">Personalized plans powered by Claude AI</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
        {[
          { key: 'diet',    icon: Utensils, label: '🥗 Diet Plan'    },
          { key: 'workout', icon: Dumbbell, label: '💪 Workout Plan' },
          { key: 'chat',    icon: Bot,      label: '💬 AI Chat'      },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DIET PLAN TAB ── */}
      {activeTab === 'diet' && (
        <div className="card fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Your Personalized Diet Plan</h2>
              <p className="text-sm text-gray-400">Generated based on your profile and goals</p>
            </div>
            <button
              onClick={fetchDietPlan}
              disabled={dietLoading}
              className="btn-primary flex items-center gap-2"
            >
              {dietLoading ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {dietPlan ? 'Regenerate' : 'Generate Plan'}
            </button>
          </div>

          {dietLoading && (
            <div className="text-center py-12">
              <Loader size={36} className="text-sky-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Claude is creating your personalized meal plan...</p>
              <p className="text-xs text-gray-400 mt-1">This takes about 5-10 seconds</p>
            </div>
          )}

          {!dietLoading && !dietPlan && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🥗</div>
              <p>Click "Generate Plan" to get your personalized 7-day meal plan</p>
              <p className="text-xs mt-1">Make sure you've completed your profile first</p>
            </div>
          )}

          {!dietLoading && dietPlan && (
            <div className="prose prose-sm max-w-none bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              {renderText(dietPlan)}
            </div>
          )}
        </div>
      )}

      {/* ── WORKOUT PLAN TAB ── */}
      {activeTab === 'workout' && (
        <div className="card fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Your Workout Plan</h2>
              <p className="text-sm text-gray-400">5-day split tailored to your goals</p>
            </div>
            <button
              onClick={fetchWorkoutPlan}
              disabled={workoutLoading}
              className="btn-primary flex items-center gap-2"
            >
              {workoutLoading ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {workoutPlan ? 'Regenerate' : 'Generate Plan'}
            </button>
          </div>

          {workoutLoading && (
            <div className="text-center py-12">
              <Loader size={36} className="text-sky-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Building your workout program...</p>
            </div>
          )}

          {!workoutLoading && !workoutPlan && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">💪</div>
              <p>Click "Generate Plan" to get a 5-day workout split</p>
            </div>
          )}

          {!workoutLoading && workoutPlan && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              {renderText(workoutPlan)}
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === 'chat' && (
        <div className="card flex flex-col fade-in" style={{ height: 500 }}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">FitTrack AI Coach</p>
              <p className="text-xs text-green-500">● Online</p>
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm
                    ${msg.role === 'user'
                      ? 'bg-sky-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested questions */}
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {['Best exercises for fat loss?', 'How much protein do I need?', 'How to improve sleep for recovery?'].map(q => (
              <button
                key={q}
                onClick={() => { setChatInput(q) }}
                className="text-xs px-3 py-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg whitespace-nowrap hover:bg-sky-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask your fitness coach..."
              className="input flex-1"
              disabled={chatLoading}
            />
            <button
              onClick={sendChat}
              disabled={!chatInput.trim() || chatLoading}
              className="btn-primary px-4"
            >
              {chatLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
