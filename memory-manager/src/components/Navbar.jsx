import { Cpu, Play, User } from 'lucide-react'

const MENU = [
  ['beranda', 'Beranda'],
  ['tentang', 'Tentang'],
  ['perbandingan', 'Perbandingan'],
  ['tentang-kami', 'Tentang Kami']
]

export default function Navbar({ page, go, session }) {
  return (
    <header className="navbar">
      <button className="logo" onClick={() => go('beranda')}><Cpu size={26} /> Memory Manager</button>
      <nav>
        {MENU.map(([k, l]) => (
          <button key={k} className={'nav-link' + (page === k ? ' active' : '')} onClick={() => go(k)}>{l}</button>
        ))}
        <button
          className={'nav-link' + (page === 'akun' ? ' active' : '')}
          onClick={() => go('akun')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <User size={15} /> {session?.user ? 'Profil' : 'Akun'}
        </button>
      </nav>
      <button className="btn btn-dark" onClick={() => go('simulasi')}><Play size={16} /> Mulai Simulasi</button>
    </header>
  )
}