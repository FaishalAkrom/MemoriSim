import { BarChart3, Info, Lightbulb, Play, Settings, Zap, Keyboard, ClipboardCheck } from 'lucide-react'

const FEATURES = [
  [Zap, 'Simulasi Interaktif', 'Lihat proses penggantian data secara langsung'],
  [BarChart3, 'Bandingkan Algoritma', 'Ketahui perbedaan FIFO, LRU, dan Optimal'],
  [Lightbulb, 'Mudah Dipahami', 'Cocok untuk pemula maupun yang ingin belajar lebih'],
]

const STEPS = [
  [Keyboard, 'Atur Jumlah Slot Memori dan Masukkan Data', 'Tentukan kapasitas memori dan urutan data yang diinginkan.'],
  [Settings, 'Pilih Algoritma', 'Gunakan FIFO, LRU, atau Optimal.'],
  [ClipboardCheck, 'Lihat Hasilnya', 'Amati proses dan bandingkan jumlah page fault dan hit.'],
]

function Ram() {
  const leftPins = Array.from({ length: 14 })
  const rightPins = Array.from({ length: 11 })
  const chips = [0, 1, 2, 3, 4, 5]

  return (
    <div className="ram-bubble" role="img" aria-label="Ilustrasi Modul RAM dalam Gelembung Liquid Glass">
      <svg viewBox="0 0 380 162" className="ram-vector">
        <defs>
          {/* Badan PCB & Heatspreader Gelap Metalik */}
          <linearGradient id="pcbBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#090d1a" />
          </linearGradient>

          {/* Aksen Bar Aurora Tipis di Bagian Atas Modul */}
          <linearGradient id="auroraStrip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="38%" stopColor="#06b6d4" />
            <stop offset="72%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Permukaan Chip IC Silikon */}
          <linearGradient id="icChipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e2538" />
            <stop offset="100%" stopColor="#0b0f1c" />
          </linearGradient>

          {/* Konektor Pin Emas Realistis */}
          <linearGradient id="goldContact" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Kilau Kaca Diagonal di Atas Modul */}
          <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Bayangan lembut di bawah modul RAM */}
        <ellipse cx="190" cy="149" rx="152" ry="6" fill="rgba(15, 23, 42, 0.28)" />

        {/* Bentuk Utama PCB RAM dengan lekukan samping & notch bawah */}
        <path
          d="M 24 22
             H 356
             A 8 8 0 0 1 364 30
             V 58
             A 5 5 0 0 0 364 68
             V 114
             A 6 6 0 0 1 358 120
             H 220
             V 113
             A 4 4 0 0 0 212 113
             V 120
             H 22
             A 6 6 0 0 1 16 114
             V 68
             A 5 5 0 0 0 16 58
             V 30
             A 8 8 0 0 1 24 22 Z"
          fill="url(#pcbBody)"
          stroke="rgba(148, 163, 184, 0.35)"
          strokeWidth="1.2"
        />

        {/* Strip Cahaya Aurora di Tepian Atas Heatspreader */}
        <rect x="24" y="23" width="332" height="4.5" rx="2.2" fill="url(#auroraStrip)" />

        {/* Garis Jalur Sirkuit Halus (PCB Traces) */}
        <g stroke="rgba(56, 189, 248, 0.22)" strokeWidth="1" fill="none">
          <path d="M 42 96 V 104 L 48 110 H 198" />
          <path d="M 96 96 V 102 L 102 108 H 204" />
          <path d="M 150 96 V 105 H 208" />
          <path d="M 232 96 V 104 L 238 110 H 338" />
          <path d="M 286 96 V 102 L 292 108 H 344" />
          <line x1="28" y1="36" x2="352" y2="36" stroke="rgba(255,255,255,0.08)" />
        </g>

        {/* Lubang Mounting Baut Kiri & Kanan */}
        <circle cx="26" cy="44" r="3" fill="#060918" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="354" cy="44" r="3" fill="#060918" stroke="#94a3b8" strokeWidth="1" />

        {/* 6 Chip IC DRAM dengan Kaki Pin & Label Mikro */}
        {chips.map((idx) => {
          const x = 38 + idx * 52
          return (
            <g key={idx}>
              {/* Kaki Pin IC Atas & Bawah */}
              {[0, 1, 2, 3, 4].map((p) => (
                <g key={p}>
                  <rect x={x + 6 + p * 7.2} y="43" width="3" height="4" rx="0.6" fill="#cbd5e1" opacity="0.75" />
                  <rect x={x + 6 + p * 7.2} y="92" width="3" height="4" rx="0.6" fill="#cbd5e1" opacity="0.75" />
                </g>
              ))}

              {/* Badan Chip Silikon */}
              <rect
                x={x}
                y="46.5"
                width="42"
                height="46"
                rx="4.5"
                fill="url(#icChipGrad)"
                stroke="rgba(148, 163, 184, 0.32)"
                strokeWidth="1"
              />

              {/* Detail Pin-1 Dot & Garis Silkscreen Chip */}
              <circle cx={x + 6.5} cy="53" r="1.4" fill="#38bdf8" opacity="0.85" />
              <line x1={x + 12} y1="53" x2={x + 34} y2="53" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" strokeLinecap="round" />
              <line x1={x + 7} y1="68" x2={x + 35} y2="68" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={x + 7} y1="73" x2={x + 26} y2="73" stroke="rgba(56,189,248,0.35)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={x + 7} y1="84" x2={x + 35} y2="84" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />

              {/* Kapasitor SMD Kecil di Samping Chip */}
              {idx < 5 && (
                <g>
                  <rect x={x + 45.2} y="56" width="3.6" height="6.5" rx="0.8" fill="#d97706" opacity="0.85" />
                  <rect x={x + 45.2} y="76" width="3.6" height="6.5" rx="0.8" fill="#94a3b8" opacity="0.7" />
                </g>
              )}
            </g>
          )
        })}

        {/* Deretan Konektor Emas Kiri (Sebelum Notch) */}
        {leftPins.map((_, i) => (
          <rect
            key={`lp-${i}`}
            x={26 + i * 13}
            y="120"
            width="8.5"
            height="17"
            rx="1.6"
            fill="url(#goldContact)"
          />
        ))}

        {/* Deretan Konektor Emas Kanan (Setelah Notch) */}
        {rightPins.map((_, i) => (
          <rect
            key={`rp-${i}`}
            x={224 + i * 12.2}
            y="120"
            width="8.2"
            height="17"
            rx="1.6"
            fill="url(#goldContact)"
          />
        ))}

        {/* Lapisan Kilau Kaca Halus di Atas Modul */}
        <path
          d="M 24 22 H 356 A 8 8 0 0 1 364 30 V 75 Q 190 95 16 65 V 30 A 8 8 0 0 1 24 22 Z"
          fill="url(#glassSheen)"
          pointerEvents="none"
        />
      </svg>
    </div>
  )
}

export default function Home({ go }) {
  return (
    <section className="page home-liquid">
      <style>{homeLiquidCss}</style>

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

        <div className="card float hero-ram-card">
          <Ram />
          <div className="ram-meta">
            <span className="ram-label">Algoritma yang Tersedia</span>
            <div className="pills">
              <span className="pill on">FIFO</span>
              <span className="pill">LRU</span>
              <span className="pill">Optimal</span>
            </div>
            <div className="slots small">
              {[1, 2, 3].map((n) => (
                <div className="slot" key={n}>{n}</div>
              ))}
              <div className="slot empty">–</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cards3 flat">
        {FEATURES.map(([Icon, t, d]) => (
          <div key={t} className="feature">
            <div className="feature-icon-glass">
              <Icon size={24} className="accent" />
            </div>
            <div>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="center-t section-title-min">Bagaimana Cara Kerjanya?</h2>

      <div className="cards3">
        {STEPS.map(([Icon, t, d], i) => (
          <div key={t} className="card step-glass-card">
            <div className="step-top">
              <span className="num">{i + 1}</span>
              <Icon size={24} className="accent" />
            </div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const homeLiquidCss = `
/* Gelembung Liquid Glass Pembungkus Modul RAM */
.ram-bubble {
  position: relative;
  width: 100%;
  padding: 18px 16px 14px;
  border-radius: 26px;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.62) 0%,
    rgba(224, 242, 254, 0.24) 52%,
    rgba(237, 233, 254, 0.42) 100%
  );
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.96),
    inset 0 -3px 8px rgba(6, 182, 212, 0.22),
    inset 2px 0 6px rgba(255, 255, 255, 0.65),
    0 10px 28px -6px rgba(37, 99, 235, 0.14);
}

/* Kilau Cembung Atas Gelembung Kaca */
.ram-bubble::before {
  content: "";
  position: absolute;
  top: 0;
  left: 6%;
  right: 6%;
  height: 44%;
  border-radius: 0 0 50% 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.72) 0%,
    rgba(255, 255, 255, 0.12) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 2;
}

/* Bias Cahaya Bawah Gelembung Kaca */
.ram-bubble::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 14%;
  right: 14%;
  height: 18%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.28), transparent 72%);
  pointer-events: none;
  z-index: 2;
}

.ram-vector {
  position: relative;
  z-index: 1;
  width: 100%;
  display: block;
  filter: drop-shadow(0 8px 16px rgba(15, 23, 42, 0.18));
}

:root[data-theme='dark'] .ram-bubble {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.13) 0%,
    rgba(13, 20, 42, 0.36) 52%,
    rgba(56, 189, 248, 0.12) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.26);
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.42),
    inset 0 -3px 8px rgba(168, 85, 247, 0.25),
    0 12px 32px rgba(0, 0, 0, 0.42);
}

:root[data-theme='dark'] .ram-bubble::before {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.24) 0%,
    rgba(255, 255, 255, 0.04) 70%,
    transparent 100%
  );
}

/* Tata Letak Minimalis Kartu Hero & Step */
.hero-ram-card {
  padding: 1.15rem !important;
  gap: 0.9rem !important;
}

.ram-meta {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0 0.2rem;
}

.ram-label {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  opacity: 0.85;
}

.feature-icon-glass {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9);
}

:root[data-theme='dark'] .feature-icon-glass {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.22);
}

.section-title-min {
  margin-top: 0.4rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.step-glass-card {
  gap: 0.65rem !important;
}

.step-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.15rem;
}
`