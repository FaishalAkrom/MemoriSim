import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

export default function App() {
  const [profiles, setProfiles] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedLoc, setSelectedLoc] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const [{ data: profData }, { data: locData }] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_locations').select('*').order('updated_at', { ascending: false })
    ])

    setProfiles(profData || [])
    setLocations(locData || [])
    if (locData?.length && !selectedLoc) {
      setSelectedLoc(locData[0])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('monitor-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_locations' }, () => {
        fetchData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const mergedDevices = locations.map((loc) => {
    const owner = profiles.find((p) => p.id === loc.user_id) || {}
    return { ...loc, owner }
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem' }}>
              📍 Memory Manager — Monitor Dashboard
            </h1>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Pemantauan Pengguna & Lokasi Perangkat Real-Time (Supabase)
            </p>
          </div>
          <button
            onClick={fetchData}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            {loading ? 'Memuat...' : '🔄 Segarkan Data'}
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={cardStyle}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Akun Terdaftar</span>
            <strong style={{ fontSize: '1.8rem', color: '#38bdf8' }}>{profiles.length}</strong>
          </div>
          <div style={cardStyle}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Perangkat Terlacak</span>
            <strong style={{ fontSize: '1.8rem', color: '#10b981' }}>{locations.length}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 14px', fontSize: '1.1rem' }}>
              📡 Lokasi Perangkat Masuk
            </h2>

            {mergedDevices.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Belum ada data lokasi masuk. Pastikan pengguna sudah login di aplikasi Memory Manager dan mengizinkan lokasi.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mergedDevices.map((item) => {
                  const isSelected = selectedLoc?.id === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLoc(item)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(148,163,184,0.15)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{item.owner.nama_lengkap || item.owner.email || 'Pengguna Tanpa Nama'}</strong>
                        <span style={{ fontSize: '0.78rem', background: '#0f172a', padding: '3px 8px', borderRadius: '6px', color: '#38bdf8' }}>
                          {/Android|iOS/i.test(item.device_name) ? '📱' : '💻'} {item.device_name}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                        NPM: {item.owner.npm || '-'} • HP: {item.owner.no_hp || '-'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', fontFamily: 'monospace' }}>
                        {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)} (±{item.accuracy}m)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        Update: {new Date(item.updated_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>🗺️ Tampilan Peta GPS</h2>
              {selectedLoc && (
                <a
                  href={`https://www.google.com/maps?q=${selectedLoc.latitude},${selectedLoc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none' }}
                >
                  Buka Google Maps ↗
                </a>
              )}
            </div>

            {selectedLoc ? (
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.2)' }}>
                <iframe
                  title="Peta Monitor"
                  src={`https://maps.google.com/maps?q=${selectedLoc.latitude},${selectedLoc.longitude}&z=16&output=embed`}
                  width="100%"
                  height="380"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                />
              </div>
            ) : (
              <div style={{ height: '380px', display: 'grid', placeItems: 'center', background: '#1e293b', borderRadius: '10px', color: '#64748b' }}>
                Pilih perangkat di samping untuk melihat titik lokasi di peta
              </div>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 14px', fontSize: '1.1rem' }}>
            👥 Daftar Akun Terdaftar (Tabel Profiles)
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>Nama Lengkap</th>
                  <th style={{ padding: '10px' }}>NPM</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>No. HP</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{p.nama_lengkap || '-'}</td>
                    <td style={{ padding: '10px', fontFamily: 'monospace' }}>{p.npm || '-'}</td>
                    <td style={{ padding: '10px' }}>{p.email || '-'}</td>
                    <td style={{ padding: '10px' }}>{p.no_hp || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background: '#162033',
  borderRadius: '14px',
  padding: '18px',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  display: 'flex',
  flexDirection: 'column'
}