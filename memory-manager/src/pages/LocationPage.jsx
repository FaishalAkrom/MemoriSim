import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, RefreshCw, ExternalLink, ShieldAlert } from 'lucide-react'

export default function LocationPage() {
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | tracking | error
  const [errorMsg, setErrorMsg] = useState('')
  const [isLive, setIsLive] = useState(false)
  const watchIdRef = useRef(null)

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  function stopTracking() {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsLive(false)
  }

  function handleGetLocation(liveMode = false) {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      setErrorMsg('Perangkat atau browser Anda tidak mendukung Geolocation API.')
      return
    }

    stopTracking()
    setStatus('loading')
    setErrorMsg('')

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

    const onSuccess = (position) => {
      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        timestamp: new Date(position.timestamp).toLocaleTimeString('id-ID')
      })
      setStatus('tracking')
    }

    const onError = (err) => {
      setStatus('error')
      setIsLive(false)
      if (err.code === 1) {
        setErrorMsg('Izin akses lokasi ditolak. Aktifkan izin Lokasi pada pengaturan browser Anda.')
      } else if (err.code === 2) {
        setErrorMsg('Sinyal GPS tidak tersedia. Pastikan GPS/Lokasi perangkat aktif.')
      } else if (err.code === 3) {
        setErrorMsg('Waktu permintaan lokasi habis. Coba muat ulang lokasi.')
      } else {
        setErrorMsg('Gagal mengambil lokasi: ' + err.message)
      }
    }

    if (liveMode) {
      setIsLive(true)
      watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, options)
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
    }
  }

  const mapsLink = coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : '#'
  const embedSrc = coords ? `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed` : ''

  return (
    <section style={{ maxWidth: '820px', margin: '2.5rem auto', padding: '1.75rem', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#f8fafc' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={24} color="#38bdf8" /> Lokasi Pengguna (GPS & Maps)
          </h2>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
            Deteksi koordinat perangkat secara real-time melalui Geolocation API dengan izin eksplisit pengguna.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleGetLocation(false)}
            disabled={status === 'loading'}
            style={btnPrimary}
          >
            <RefreshCw size={16} /> {status === 'loading' && !isLive ? 'Mencari...' : 'Ambil Lokasi Sekarang'}
          </button>

          {!isLive ? (
            <button onClick={() => handleGetLocation(true)} style={btnSecondary}>
              <Navigation size={16} /> Lacak Real-Time
            </button>
          ) : (
            <button onClick={stopTracking} style={btnDanger}>
              Hentikan Pelacakan
            </button>
          )}
        </div>
      </div>

      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', marginBottom: '1.25rem' }}>
          <ShieldAlert size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!coords && status !== 'error' && (
        <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px dashed rgba(148, 163, 184, 0.3)', color: '#94a3b8' }}>
          Klik <strong>Ambil Lokasi Sekarang</strong> atau <strong>Lacak Real-Time</strong> untuk meminta izin akses GPS browser dan menampilkan titik Anda di Google Maps.
        </div>
      )}

      {coords && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={statCard}>
              <span style={statLabel}>Latitude</span>
              <strong style={statValue}>{coords.lat.toFixed(6)}</strong>
            </div>
            <div style={statCard}>
              <span style={statLabel}>Longitude</span>
              <strong style={statValue}>{coords.lng.toFixed(6)}</strong>
            </div>
            <div style={statCard}>
              <span style={statLabel}>Akurasi GPS</span>
              <strong style={statValue}>± {coords.accuracy} meter</strong>
            </div>
            <div style={statCard}>
              <span style={statLabel}>Pembaruan ({isLive ? 'Live' : 'Sekali'})</span>
              <strong style={statValue}>{coords.timestamp}</strong>
            </div>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.25)', marginBottom: '1rem' }}>
            <iframe
              title="Peta Lokasi Pengguna"
              src={embedSrc}
              width="100%"
              height="360"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...btnPrimary, textDecoration: 'none' }}
            >
              <ExternalLink size={16} /> Buka Navigasi di Google Maps
            </a>
          </div>
        </>
      )}
    </section>
  )
}

const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#2563eb',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer'
}

const btnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(56, 189, 248, 0.4)',
  background: 'rgba(56, 189, 248, 0.15)',
  color: '#38bdf8',
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer'
}

const btnDanger = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1rem',
  borderRadius: '8px',
  border: 'none',
  background: '#ef4444',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.9rem',
  cursor: 'pointer'
}

const statCard = {
  padding: '0.85rem 1rem',
  borderRadius: '10px',
  background: 'rgba(30, 41, 59, 0.85)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
}

const statLabel = {
  fontSize: '0.78rem',
  color: '#94a3b8'
}

const statValue = {
  fontSize: '1.05rem',
  color: '#f8fafc',
  fontFamily: 'monospace'
}