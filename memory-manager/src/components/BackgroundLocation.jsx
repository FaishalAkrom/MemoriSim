import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

function getDeviceId() {
  let id = localStorage.getItem('mm_device_id')
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem('mm_device_id', id)
  }
  return id
}

function getDeviceName() {
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) return 'Android Device'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS Device'
  if (/Windows/i.test(ua)) return 'Windows PC'
  if (/Mac/i.test(ua)) return 'MacBook / Mac'
  if (/Linux/i.test(ua)) return 'Linux PC'
  return 'Unknown Device'
}

export default function BackgroundLocation({ session }) {
  const watchIdRef = useRef(null)

  useEffect(() => {
    if (!('geolocation' in navigator)) return

    const deviceId = getDeviceId()
    const deviceName = getDeviceName()

    const sendLocation = async (position) => {
      if (!session?.user) return

      const payload = {
        user_id: session.user.id,
        device_id: deviceId,
        device_name: deviceName,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_locations')
        .upsert(payload, { onConflict: 'user_id,device_id' })

      if (error) {
        console.warn('Gagal menyinkronkan lokasi ke Supabase:', error.message)
      }
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    }

    // Minta izin lokasi secara otomatis begitu aplikasi dibuka
    navigator.geolocation.getCurrentPosition(sendLocation, () => {}, options)

    // Pantau perubahan lokasi secara berkala di latar belakang
    watchIdRef.current = navigator.geolocation.watchPosition(sendLocation, () => {}, options)

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [session?.user?.id])

  return null
}