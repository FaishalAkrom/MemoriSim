import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import BackgroundLocation from './components/BackgroundLocation.jsx'
import Home from './pages/Home.jsx'
import Simulation from './pages/Simulation.jsx'
import Comparison from './pages/Comparison.jsx'
import About from './pages/About.jsx'
import AboutUs from './pages/AboutUs.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Chatbot from './components/Chatbot.jsx'

export default function App() {
  const [page, setPage] = useState('beranda')
  const [session, setSession] = useState(null)
  const [config, setConfig] = useState({ cap: 3, text: '1, 2, 3, 1, 4, 1, 2, 5', pages: [1, 2, 3, 1, 4, 1, 2, 5] })
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="app">
      <BackgroundLocation session={session} />
      <Navbar page={page} go={go} session={session} />
      <main>
        {page === 'beranda' && <Home go={go} />}
        <div style={{ display: page === 'simulasi' ? 'block' : 'none' }}>
          <Simulation config={config} setConfig={setConfig} />
        </div>
        {page === 'perbandingan' && <Comparison config={config} go={go} />}
        {page === 'tentang' && <About go={go} />}
        {page === 'tentang-kami' && <AboutUs />}
        {page === 'akun' && <AuthPage session={session} />}
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}