import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Stop, Route } from '@/lib/supabase/types'
import type { LatLng } from '@/store/searchSlice'
import styles from './MapView.module.css'

// Fix default marker icons broken by Vite's asset handling
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapViewProps {
  stops: Stop[]
  routes: Route[]
  onStopClick: (stop: Stop) => void
  userLocation?: LatLng | null
}

const LVIV_CENTER: L.LatLngTuple = [49.8397, 24.0297]
const DEFAULT_ZOOM = 13

const MapView = ({ stops, onStopClick, userLocation }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const hasFlewRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Try to read a saved location synchronously (store or localStorage cache)
    // so the map opens at the right place with no zoom animation.
    let seedLocation = userLocation
    if (!seedLocation) {
      try {
        const cached = localStorage.getItem('lastLocation')
        if (cached) {
          const loc = JSON.parse(cached)
          if (loc?.lat && loc?.lng) seedLocation = loc
        }
      } catch {}
    }

    const initCenter: L.LatLngTuple = seedLocation
      ? [seedLocation.lat, seedLocation.lng]
      : LVIV_CENTER
    const initZoom = seedLocation ? 15 : DEFAULT_ZOOM

    mapRef.current = L.map(containerRef.current, {
      center: initCenter,
      zoom: initZoom,
      zoomControl: false,
    })

    // Mark as flown so the location effect won't re-animate what we already set
    if (seedLocation) hasFlewRef.current = true

    mapRef.current.attributionControl.setPrefix(false)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      userMarkerRef.current = null
      hasFlewRef.current = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Add/update stop markers whenever stops change
  useEffect(() => {
    if (!mapRef.current) return

    stops.forEach((stop) => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="${styles.stopDot}" title="${stop.name}"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      L.marker([stop.lat, stop.lng], { icon })
        .addTo(mapRef.current!)
        .on('click', () => onStopClick(stop))
    })
  }, [stops, onStopClick])

  // Pan + zoom to user location, show pulsing dot
  useEffect(() => {
    if (!mapRef.current || !userLocation) return

    const icon = L.divIcon({
      className: '',
      html: `<svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="${styles.locationIcon}"><path d="M32 14C22.6112 14 15 21.7442 15 31.2945C15 40.8447 28.3614 56 32 56C35.6373 56 49 40.8447 49 31.2945C49 21.7442 41.3889 14 32 14ZM32 39.2323C27.6898 39.2323 24.1973 35.6781 24.1973 31.2945C24.1973 26.9097 27.6898 23.3566 32 23.3566C36.3089 23.3566 39.8027 26.9097 39.8027 31.2945C39.8027 35.6781 36.3089 39.2323 32 39.2323Z" fill="currentColor"/></svg>`,
      iconSize: [32, 32],
      iconAnchor: [16, 28],
    })

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon, zIndexOffset: 1000 })
        .addTo(mapRef.current)
    }

    // Fly only on the first location fix — subsequent GPS updates just move the marker
    if (!hasFlewRef.current) {
      hasFlewRef.current = true
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.2 })
    } else {
      mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: false })
    }
  }, [userLocation])

  return <div ref={containerRef} className={styles.map} />
}

export default MapView
