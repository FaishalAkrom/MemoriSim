import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Simulation from './pages/Simulation.jsx'
import Comparison from './pages/Comparison.jsx'
import About from './pages/About.jsx'
import AboutUs from './pages/AboutUs.jsx'

export default function App() {
  const [page, setPage] = useState('beranda')
  // Input simulasi dipakai bersama oleh halaman Simulasi dan Perbandingan.
  const [config, setConfig] = useState({ cap: 3, text: '1, 2, 3, 1, 4, 1, 2, 5', pages: [1, 2, 3, 1, 4, 1, 2, 5] })
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return (
    <div className="app">
      <Navbar page={page} go={go} />
      <main>
        {page === 'beranda' && <Home go={go} />}
        {page === 'simulasi' && <Simulation config={config} setConfig={setConfig} />}
        {page === 'perbandingan' && <Comparison config={config} go={go} />}
        {page === 'tentang' && <About go={go} />}
        {page === 'tentang-kami' && <AboutUs />}
      </main>
      <Footer />
    </div>
  )
}