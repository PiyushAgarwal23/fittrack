// src/pages/GymLocator.jsx
// Finds nearby gyms using OpenStreetMap's Overpass API (FREE - no API key needed)
// Displays results on a Leaflet.js map (also FREE)

import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader, Navigation } from 'lucide-react'

// Leaflet is loaded via CDN in index.html, accessed via window.L
// We use dynamic imports to avoid SSR issues

export default function GymLocator() {
  const mapRef      = useRef(null)  // DOM element for the map
  const leafletMap  = useRef(null)  // Leaflet map instance
  const [status, setStatus]   = useState('idle')   // 'idle' | 'loading' | 'done' | 'error'
  const [gyms, setGyms]       = useState([])
  const [error, setError]     = useState('')
  const [userPos, setUserPos] = useState(null)

  // Cleanup map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [])

  // Initialize Leaflet map once we have a position
  const initMap = (lat, lng) => {
    if (!mapRef.current || leafletMap.current) return

    const L = window.L
    if (!L) { setError('Map library not loaded. Refresh the page.'); return }

    // Create map centered on user location
    const map = L.map(mapRef.current).setView([lat, lng], 14)
    leafletMap.current = map

    // Use OpenStreetMap tiles (FREE, no API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Add user location marker (blue dot)
    L.circleMarker([lat, lng], {
      radius: 10, color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup('<b>📍 Your Location</b>')
    .openPopup()
  }

  // Add gym markers to the map
  const addGymMarkers = (gymsData) => {
    const L = window.L
    if (!L || !leafletMap.current) return

    gymsData.forEach(gym => {
      const marker = L.marker([gym.lat, gym.lng])
        .addTo(leafletMap.current)
        .bindPopup(`
          <div style="min-width:150px">
            <b>🏋️ ${gym.name}</b>
            ${gym.address ? `<br><small>${gym.address}</small>` : ''}
            ${gym.phone   ? `<br><small>📞 ${gym.phone}</small>`   : ''}
            ${gym.website ? `<br><a href="${gym.website}" target="_blank">🌐 Website</a>` : ''}
          </div>
        `)
      marker.on('click', () => marker.openPopup())
    })
  }

  // Main function: get location → search gyms → show on map
  const findGyms = () => {
    setStatus('loading')
    setError('')
    setGyms([])

    // 1. Get user's GPS location
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setStatus('error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        setUserPos({ lat, lng })

        // 2. Initialize map
        initMap(lat, lng)

        try {
          // 3. Search for gyms using OpenStreetMap Overpass API
          // This finds all "gym" amenities within 3km of the user
          const query = `
            [out:json][timeout:25];
            (
              node["leisure"="fitness_centre"](around:3000,${lat},${lng});
              node["amenity"="gym"](around:3000,${lat},${lng});
              way["leisure"="fitness_centre"](around:3000,${lat},${lng});
            );
            out body;
            >;
            out skel qt;
          `

          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
          })

          if (!response.ok) throw new Error('Failed to fetch gyms')

          const data = await response.json()

          // Parse the OSM data
          const foundGyms = data.elements
            .filter(el => el.tags && el.tags.name) // Only named gyms
            .map(el => ({
              id: el.id,
              name: el.tags.name || 'Gym',
              lat: el.lat || (el.center?.lat),
              lng: el.lon || (el.center?.lon),
              address: el.tags['addr:street']
                ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`
                : null,
              phone:   el.tags.phone   || el.tags['contact:phone'] || null,
              website: el.tags.website || el.tags['contact:website'] || null,
            }))
            .filter(g => g.lat && g.lng) // Must have coordinates
            .slice(0, 15) // Limit to 15 results

          setGyms(foundGyms)
          addGymMarkers(foundGyms)
          setStatus('done')

        } catch (err) {
          console.error(err)
          setError('Could not find gyms. Please try again.')
          setStatus('error')
        }
      },
      (err) => {
        const messages = {
          1: 'Location access denied. Please allow location access in your browser.',
          2: 'Location unavailable. Try again.',
          3: 'Location request timed out.'
        }
        setError(messages[err.code] || 'Failed to get location.')
        setStatus('error')
      },
      { timeout: 10000 } // 10 second timeout
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="section-title">🗺️ Gym Locator</h1>
        <p className="section-subtitle">Find gyms near you using OpenStreetMap (no API key needed)</p>
      </div>

      {/* Find gyms button */}
      {status === 'idle' && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Gyms Near You</h2>
          <p className="text-gray-500 mb-6">We'll use your location to find nearby gyms</p>
          <button onClick={findGyms} className="btn-primary inline-flex items-center gap-2">
            <Navigation size={18} />
            Use My Location
          </button>
        </div>
      )}

      {/* Loading state */}
      {status === 'loading' && (
        <div className="card text-center py-12">
          <Loader size={40} className="text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Finding gyms near you...</p>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="card text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={findGyms} className="btn-primary">Try Again</button>
        </div>
      )}

      {/* Results */}
      {status === 'done' && (
        <div className="space-y-4">
          {/* Map */}
          <div className="card p-0 overflow-hidden" style={{ height: 400 }}>
            <div ref={mapRef} style={{ height: '100%' }} />
          </div>

          {/* Gym list */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {gyms.length > 0 ? `Found ${gyms.length} gyms nearby` : 'No gyms found nearby'}
              </h3>
              <button onClick={findGyms} className="text-sm text-sky-500 hover:underline">Refresh</button>
            </div>

            {gyms.length === 0 ? (
              <p className="text-gray-400 text-sm">Try expanding the search area or moving to a different location.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {gyms.map(gym => (
                  <div key={gym.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-xl">🏋️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{gym.name}</p>
                      {gym.address && <p className="text-xs text-gray-400">{gym.address}</p>}
                      {gym.phone   && <p className="text-xs text-gray-400">📞 {gym.phone}</p>}
                    </div>
                    {gym.website && (
                      <a href={gym.website} target="_blank" rel="noreferrer"
                        className="text-xs text-sky-500 hover:underline shrink-0">
                        Visit →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
