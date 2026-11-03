import { BarChart3, Info, Lightbulb, Play, Settings, Zap, Keyboard, ClipboardCheck } from 'lucide-react'
const FEATURES = [[Zap, 'Simulasi Interaktif', 'Lihat proses penggantian data secara langsung'], [BarChart3, 'Bandingkan Algoritma', 'Ketahui perbedaan FIFO, LRU, dan Optimal'], [Lightbulb, 'Mudah Dipahami', 'Cocok untuk pemula maupun yang ingin belajar lebih']]
const STEPS = [[Keyboard, 'Atur Jumlah Slot Memori dan Masukkan Data', 'Tentukan kapasitas memori dan urutan data yang diinginkan.'], [Settings, 'Pilih Algoritma', 'Gunakan FIFO, LRU, atau Optimal.'], [ClipboardCheck, 'Lihat Hasilnya', 'Amati proses dan bandingkan jumlah page fault dan hit.']]

function Ram() {
  return (
    <svg viewBox="0 0 300 130" className="ram" role="img" aria-label="Ilustrasi RAM">
      <rect x="5" y="15" width="290" height="85" rx="10" fill="#22a06b" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={25 + i * 54} y="32" width="40" height="40" rx="6" fill="#1c2b4a" />)}
      {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={14 + i * 11.8} y="100" width="7" height="18" fill="#f5c542" />)}
    </svg>
  )
}

export default function Home({ go }) {
  return (
    <section className="page">
      <div className="hero">
        <div>
          <h1 className="big">Pengelolaan Memori Komputer</h1>
          <h2>Menggunakan Algoritma <span className="accent">FIFO, LRU,</span> dan <span className="accent">Optimal</span></h2>
          <p className="sub">Pahami cara kerja memori komputer dengan simulasi yang interaktif dan mudah dipahami!</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => go('simulasi')}><Play size={16} /> Mulai Simulasi</button>
            <button className="btn btn-ghost" onClick={() => go('tentang')}><Info size={16} /> Pelajari Lebih Lanjut</button>
          </div>
        </div>
        <div className="card float"><Ram /><b>Algoritma yang Tersedia:</b>
          <div className="pills"><span className="pill on">FIFO</span><span className="pill">LRU</span><span className="pill">Optimal</span></div>
          <div className="slots small">{[1, 2, 3].map((n) => <div className="slot" key={n}>{n}</div>)}<div className="slot empty">–</div></div>
        </div>
      </div>
      <div className="cards3 flat">
        {FEATURES.map(([Icon, t, d]) => <div key={t} className="feature"><Icon size={34} className="accent" /><div><b>{t}</b><p>{d}</p></div></div>)}
      </div>
      <h2 className="center-t">Bagaimana Cara Kerjanya?</h2>
      <div className="cards3">
        {STEPS.map(([Icon, t, d], i) => <div key={t} className="card"><span className="num">{i + 1}</span><Icon size={30} className="accent" /><h3>{t}</h3><p>{d}</p></div>)}
      </div>
    </section>
  )
}
