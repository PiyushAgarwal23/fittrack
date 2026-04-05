// src/pages/Shop.jsx
// Mock fitness e-commerce store with categories and cart
// Uses static data (no backend needed for this feature)

import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Star } from 'lucide-react'

// Mock product data - in a real app this comes from an API
const PRODUCTS = [
  // Equipment
  { id: 1,  category: 'equipment', name: 'Adjustable Dumbbells Set',  price: 4999, rating: 4.8, reviews: 234, emoji: '🏋️', badge: 'Best Seller', desc: '5-52.5 lbs adjustable, space-saving' },
  { id: 2,  category: 'equipment', name: 'Resistance Bands Set',       price: 799,  rating: 4.6, reviews: 891, emoji: '💪', badge: 'Popular',     desc: '5 levels from light to heavy' },
  { id: 3,  category: 'equipment', name: 'Pull-Up Bar (Door)',         price: 1299, rating: 4.5, reviews: 567, emoji: '🔗', badge: null,           desc: 'No screws needed, fits most doors' },
  { id: 4,  category: 'equipment', name: 'Yoga Mat Pro',               price: 1999, rating: 4.7, reviews: 345, emoji: '🧘', badge: 'New',          desc: '6mm thick, non-slip surface' },
  { id: 5,  category: 'equipment', name: 'Jump Rope Speed',            price: 499,  rating: 4.4, reviews: 678, emoji: '🪢', badge: null,           desc: 'Ball bearings for speed training' },
  { id: 6,  category: 'equipment', name: 'Foam Roller',                price: 899,  rating: 4.3, reviews: 412, emoji: '🔵', badge: null,           desc: 'Deep tissue massage recovery' },

  // Clothes
  { id: 7,  category: 'clothes', name: 'Dry-Fit Training Shirt',       price: 699,  rating: 4.5, reviews: 289, emoji: '👕', badge: null,           desc: 'Moisture-wicking, 4-way stretch' },
  { id: 8,  category: 'clothes', name: 'Compression Shorts',           price: 899,  rating: 4.6, reviews: 445, emoji: '🩳', badge: 'Top Rated',   desc: 'Reduced muscle fatigue & soreness' },
  { id: 9,  category: 'clothes', name: 'Training Sneakers',            price: 3499, rating: 4.8, reviews: 156, emoji: '👟', badge: 'Best Seller', desc: 'Cushioned sole, wide toe box' },
  { id: 10, category: 'clothes', name: 'Gym Gloves',                   price: 599,  rating: 4.3, reviews: 321, emoji: '🥊', badge: null,           desc: 'Full palm protection + wrist wrap' },

  // Supplements
  { id: 11, category: 'supps', name: 'Whey Protein (1kg)',             price: 2499, rating: 4.7, reviews: 1203,emoji: '🥛', badge: 'Best Seller', desc: '24g protein/serving, 5g BCAA' },
  { id: 12, category: 'supps', name: 'Creatine Monohydrate',           price: 999,  rating: 4.8, reviews: 892, emoji: '⚗️', badge: 'Top Rated',   desc: 'Pure micronized creatine, 250g' },
  { id: 13, category: 'supps', name: 'Pre-Workout Energy',             price: 1499, rating: 4.4, reviews: 445, emoji: '⚡', badge: null,           desc: '200mg caffeine, beta-alanine, citrulline' },
  { id: 14, category: 'supps', name: 'BCAA Recovery Blend',            price: 1299, rating: 4.5, reviews: 334, emoji: '🔬', badge: null,           desc: '2:1:1 ratio, includes electrolytes' },
  { id: 15, category: 'supps', name: 'Multivitamin Daily',             price: 699,  rating: 4.6, reviews: 678, emoji: '💊', badge: null,           desc: '23 vitamins & minerals, 60 tablets' },
]

const CATEGORIES = [
  { key: 'all',       label: 'All',          emoji: '🛍️' },
  { key: 'equipment', label: 'Equipment',    emoji: '🏋️' },
  { key: 'clothes',   label: 'Clothing',     emoji: '👕' },
  { key: 'supps',     label: 'Supplements',  emoji: '💊' },
]

// Format price in Indian Rupees
const formatPrice = (paise) => `₹${paise.toLocaleString('en-IN')}`

export default function Shop() {
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState([])           // Array of { product, qty }
  const [cartOpen, setCartOpen] = useState(false)
  const [addedId, setAddedId] = useState(null)   // Which product was just added (for animation)

  // Filter products by selected category
  const filtered = category === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category)

  // Add to cart
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { product, qty: 1 }]
    })
    // Show "Added!" animation
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1000)
  }

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0) // Remove if qty reaches 0
    )
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">🛍️ Fitness Shop</h1>
          <p className="section-subtitle">Equipment, clothing & supplements</p>
        </div>
        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative btn-secondary flex items-center gap-2"
        >
          <ShoppingCart size={18} />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${category === cat.key
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-sky-300'
              }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">

            {/* Product emoji / image */}
            <div className="text-center text-5xl mb-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              {product.emoji}
            </div>

            {/* Badge */}
            {product.badge && (
              <span className="self-start text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full font-medium mb-1">
                {product.badge}
              </span>
            )}

            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 mb-2 flex-1">{product.desc}</p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>

            {/* Price + Add to cart */}
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              <button
                onClick={() => addToCart(product)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all
                  ${addedId === product.id
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-sky-500 text-white hover:bg-sky-600'
                  }`}
              >
                {addedId === product.id ? '✓ Added!' : '+ Add'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── CART SIDEBAR ── */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setCartOpen(false)} />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col">
            {/* Cart header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white">🛒 Your Cart ({cartCount} items)</h2>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-3">🛒</p>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <span className="text-2xl">{product.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-sky-500 font-semibold">{formatPrice(product.price)}</p>
                    </div>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(product.id, -1)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{qty}</span>
                      <button onClick={() => updateQty(product.id, +1)} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  className="btn-primary w-full"
                  onClick={() => alert('🚧 Payment integration coming soon!\nThis is a demo store.')}
                >
                  Proceed to Checkout →
                </button>
                <button
                  onClick={() => setCart([])}
                  className="w-full text-center text-sm text-red-500 mt-2 hover:underline"
                >
                  Clear cart
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
