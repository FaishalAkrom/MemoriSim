import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AuthPage({ session }) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [namaLengkap, setNamaLengkap] = useState('')
  const [npm, setNpm] = useState('')
  const [noHp, setNoHp] = useState('')
  const [alamat, setAlamat] = useState('')

  useEffect(() => {
    if (session?.user) {
      fetchProfile(session.user.id)
    } else {
      setNamaLengkap('')
      setNpm('')
      setNoHp('')
      setAlamat('')
    }
  }, [session])

  async function fetchProfile(userId) {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (!error && data) {
      setNamaLengkap(data.nama_lengkap || '')
      setNpm(data.npm || '')
      setNoHp(data.no_hp || '')
      setAlamat(data.alamat || '')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (isRegister) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) {
        setMessage({ type: 'error', text: authError.message })
        setLoading(false)
        return
      }

      if (authData?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            email,
            nama_lengkap: namaLengkap,
            npm,
            no_hp: noHp,
            alamat
          }
        ])

        if (profileError) {
          setMessage({ type: 'error', text: 'Akun dibuat, gagal simpan profil: ' + profileError.message })
        } else {
          setMessage({ type: 'success', text: 'Registrasi berhasil! Anda telah masuk.' })
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: 'Login gagal: ' + error.message })
      } else {
        setMessage({ type: 'success', text: 'Berhasil masuk!' })
      }
    }

    setLoading(false)
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        email: session.user.email,
        nama_lengkap: namaLengkap,
        npm,
        no_hp: noHp,
        alamat,
        updated_at: new Date().toISOString()
      })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' })
      fetchProfile(session.user.id)
    }
    setLoading(false)
  }

  async function handleLogout() {
    setMessage({ type: '', text: '' })
    await supabase.auth.signOut()
  }

  if (session?.user) {
    return (
      <section className="card" style={{ maxWidth: '540px', margin: '3rem auto', padding: '1.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Profil Pengguna</h2>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1.05rem',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #ec4899)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Keluar
          </button>
        </div>

        <p className="sub" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Email Terdaftar: <strong>{session.user.email}</strong>
        </p>

        {message.text && (
          <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '1rem' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input type="text" placeholder="Nama Lengkap" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="NPM" value={npm} onChange={(e) => setNpm(e.target.value)} required style={inputStyle} />
          <input type="tel" placeholder="Nomor HP" value={noHp} onChange={(e) => setNoHp(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Alamat Lengkap" rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} required style={inputStyle} />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="card" style={{ maxWidth: '460px', margin: '3rem auto', padding: '1.85rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '0.4rem' }}>
        {isRegister ? 'Daftar Akun Baru' : 'Masuk ke Memory Manager'}
      </h2>
      <p className="sub" style={{ marginTop: 0, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        {isRegister ? 'Lengkapi biodata untuk menyimpan profil Anda.' : 'Masuk menggunakan email dan password Anda.'}
      </p>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`} style={{ marginBottom: '1rem' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password (min. 6 karakter)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

        {isRegister && (
          <>
            <input type="text" placeholder="Nama Lengkap" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="NPM" value={npm} onChange={(e) => setNpm(e.target.value)} required style={inputStyle} />
            <input type="tel" placeholder="Nomor HP" value={noHp} onChange={(e) => setNoHp(e.target.value)} required style={inputStyle} />
            <textarea placeholder="Alamat Lengkap" rows={2} value={alamat} onChange={(e) => setAlamat(e.target.value)} required style={inputStyle} />
          </>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', marginTop: '0.25rem' }}>
          {loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk'}
        </button>
      </form>

      <div className="sub" style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
        {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setMessage({ type: '', text: '' }) }}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer',
            fontWeight: 700,
            textDecoration: 'underline'
          }}
        >
          {isRegister ? 'Masuk di sini' : 'Daftar di sini'}
        </button>
      </div>
    </section>
  )
}

const inputStyle = {
  padding: '0.75rem 0.95rem',
  borderRadius: '12px',
  fontSize: '0.95rem',
  width: '100%'
}