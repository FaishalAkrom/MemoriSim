import { useState, useEffect, useRef } from "react";

const rawBase = import.meta.env.BASE_URL || "/";
const BASE = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

const ANGGOTA = [
  { nama: "Chalisa Adelia Putri", npm: "257006111072", foto: "chalisa.jpeg", warna: "blue", posisi: "center 32%" },
  { nama: "Muhammad Faishal Akrom", npm: "257006111079", foto: "faishal.jpeg", warna: "green", posisi: "center 55%" },
  { nama: "Hilmi Juliansyah", npm: "257006111080", foto: "hilmi.jpeg", warna: "orange", posisi: "center 35%" },
  { nama: "Muhammad Alfaridzi Hudmawan", npm: "257006111085", foto: "alpa.jpeg", warna: "blue", posisi: "center 58%" },
  { nama: "Muhammad Fatan Labiba", npm: "257006111093", foto: "fatan.jpeg", musik: `${BASE}foto/fatan.mp3`, warna: "green", posisi: "center 62%" },
  { nama: "Rakha Fauzan Nughraha", npm: "257006111083", foto: "rakha.jpg", musik: `${BASE}foto/rakha.mpeg`, warna: "orange", posisi: "center 38%" },
];

const inisial = (nama) =>
  nama.split(" ").filter(Boolean).slice(0, 2).map((k) => k[0]).join("").toUpperCase();

const swapExt = (file) =>
  file.endsWith(".jpg") ? file.replace(/\.jpg$/, ".jpeg") : file.replace(/\.jpeg$/, ".jpg");

export default function AboutUs() {
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [resolvedSrc, setResolvedSrc] = useState({});
  const [failedImg, setFailedImg] = useState({});
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);

  const getFotoUrl = (anggota) => `${BASE}foto/${resolvedSrc[anggota.npm] || anggota.foto}`;

  const handleImgError = (anggota) => {
    const currentFile = resolvedSrc[anggota.npm] || anggota.foto;
    const altFile = swapExt(anggota.foto);
    if (currentFile !== altFile) {
      setResolvedSrc((prev) => ({ ...prev, [anggota.npm]: altFile }));
    } else {
      setFailedImg((prev) => ({ ...prev, [anggota.npm]: true }));
    }
  };

  useEffect(() => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (selectedFoto?.musik) {
      const audio = new Audio(selectedFoto.musik);
      audio.loop = true;
      audio.volume = 1.0;
      audioRef.current = audio;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.05;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      audio
        .play()
        .then(() => {
          let level = 0.05;
          const targetGain = 2.5;
          fadeTimerRef.current = setInterval(() => {
            level = Math.min(targetGain, +(level + 0.12).toFixed(2));
            gainNode.gain.value = level;
            if (level >= targetGain) {
              clearInterval(fadeTimerRef.current);
              fadeTimerRef.current = null;
            }
          }, 80);
        })
        .catch((err) => {
          console.warn("Gagal memutar audio:", err);
        });
    }

    return () => {
      if (fadeTimerRef.current) {
        clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [selectedFoto]);

  return (
    <main className="tk">
      <style>{css}</style>

      <header className="tk-head">
        <div>
          <span className="tk-pill">Kelompok 8 • Sistem Operasi</span>
          <h1 className="tk-judul">Anggota Tim</h1>
        </div>
      </header>

      <div className="tk-grid">
        {ANGGOTA.map((a) => (
          <article key={a.npm} className={`tk-card tk-member ${a.warna}`}>
            {a.foto && !failedImg[a.npm] ? (
              <div
                className="tk-foto-wrap"
                onClick={() => setSelectedFoto(a)}
                title="Klik untuk melihat foto penuh"
              >
                <img
                  className="tk-foto"
                  src={getFotoUrl(a)}
                  alt={`Foto ${a.nama}`}
                  onError={() => handleImgError(a)}
                  style={{ objectPosition: a.posisi || "center center" }}
                />
                <span className="tk-zoom-hint">Lihat Penuh</span>
              </div>
            ) : (
              <div className="tk-avatar-wrap">
                <div className="tk-avatar" aria-hidden="true">{inisial(a.nama)}</div>
              </div>
            )}

            <div className="tk-info">
              <h3>{a.nama}</h3>
              <span className="tk-nim">NPM {a.npm}</span>
            </div>
          </article>
        ))}
      </div>

      <section className="tk-note">
        <strong>Proyek:</strong> Memory Manager — Simulasi Page Replacement (FIFO, LRU, Optimal).
        Mata kuliah Sistem Operasi, Kelompok 8.
      </section>

      {selectedFoto && (
        <div className="tk-modal" onClick={() => setSelectedFoto(null)}>
          <div className="tk-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="tk-modal-close"
              onClick={() => setSelectedFoto(null)}
              aria-label="Tutup foto"
            >
              ✕
            </button>
            <img
              src={getFotoUrl(selectedFoto)}
              alt={`Foto ${selectedFoto.nama}`}
            />
            <div className="tk-modal-caption">
              <strong>{selectedFoto.nama}</strong>
              <span>NPM {selectedFoto.npm}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const css = `
.tk{
  --navy:#0f172a;--blue:#06b6d4;--green:#10b981;--orange:#8b5cf6;--ink:#334155;
  max-width:1106px;margin:0 auto;padding:28px 16px 60px;color:var(--ink);
  font-family:inherit
}
.tk-head{margin-bottom:24px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.tk-pill{
  display:inline-block;padding:6px 14px;border-radius:999px;font-size:.78rem;font-weight:700;
  letter-spacing:.02em;background:rgba(56,189,248,.15);border:1px solid rgba(56,189,248,.35);
  color:#0284c7;margin-bottom:8px
}
.tk-judul{color:var(--navy);font-size:2rem;font-weight:800;margin:0;line-height:1.2}

.tk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.tk-card{
  background:rgba(255,255,255,.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border:1px solid rgba(99,102,241,.18);border-radius:20px;box-shadow:0 8px 26px rgba(37,99,235,.08)
}
.tk-member{
  padding:14px 14px 20px;border-top:4px solid var(--c);
  display:flex;flex-direction:column;gap:14px;
  transition:transform .24s ease, box-shadow .24s ease, border-color .24s ease
}
.tk-member:hover{
  transform:translateY(-4px);
  box-shadow:0 12px 32px rgba(56,189,248,.22), 0 6px 20px rgba(139,92,246,.2)
}
.tk-member.blue{--c:var(--blue)}
.tk-member.green{--c:var(--green)}
.tk-member.orange{--c:var(--orange)}

.tk-foto-wrap{
  width:100%;height:190px;border-radius:14px;overflow:hidden;
  cursor:zoom-in;background:rgba(15,23,42,.08);position:relative
}
.tk-foto{width:100%;height:100%;object-fit:cover;transition:transform .3s ease;display:block}
.tk-foto-wrap:hover .tk-foto{transform:scale(1.05)}
.tk-zoom-hint{
  position:absolute;right:10px;bottom:10px;padding:4px 10px;border-radius:999px;
  background:linear-gradient(135deg, rgba(6,182,212,.85), rgba(139,92,246,.85));
  color:#fff;font-size:.72rem;font-weight:600;
  opacity:0;transform:translateY(4px);transition:opacity .2s ease, transform .2s ease;
  backdrop-filter:blur(6px)
}
.tk-foto-wrap:hover .tk-zoom-hint{opacity:1;transform:translateY(0)}

.tk-avatar-wrap{width:100%;height:190px;border-radius:14px;background:rgba(56,189,248,.12);display:grid;place-items:center}
.tk-avatar{
  width:64px;height:64px;border-radius:50%;background:var(--c);color:#fff;
  display:grid;place-items:center;font-weight:800;font-size:1.35rem
}

.tk-info{padding:0 6px;display:flex;flex-direction:column;gap:4px}
.tk-member h3{margin:0;color:var(--navy);font-size:1.06rem;font-weight:700;line-height:1.35}
.tk-nim{
  display:inline-flex;align-items:center;width:fit-content;
  font-size:.82rem;font-weight:600;color:#475569;
  background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.22);
  padding:3px 9px;border-radius:8px;margin-top:2px
}

.tk-note{
  margin-top:32px;padding:14px 18px;border-radius:14px;
  background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.24);
  color:var(--navy);line-height:1.5;font-size:.92rem
}

/* Dukungan Aurora Dark Mode */
body.dark .tk-judul, [data-theme="dark"] .tk-judul{color:#f8fafc}
body.dark .tk-pill, [data-theme="dark"] .tk-pill{background:rgba(56,189,248,.15);color:#38bdf8;border-color:rgba(56,189,248,.35)}
body.dark .tk-card, [data-theme="dark"] .tk-card{background:rgba(15,23,42,.62) !important;border-color:rgba(148,163,184,.16) !important;box-shadow:0 10px 30px rgba(0,0,0,.45)}
body.dark .tk-member h3, [data-theme="dark"] .tk-member h3{color:#f8fafc}
body.dark .tk-nim, [data-theme="dark"] .tk-nim{background:rgba(23,33,61,.85);border-color:rgba(148,163,184,.2);color:#94a3b8}
body.dark .tk-note, [data-theme="dark"] .tk-note{background:rgba(59,130,246,.14);border-color:rgba(56,189,248,.28);color:#cbd5e1}

/* Modal Foto Penuh */
.tk-modal{
  position:fixed;inset:0;background:rgba(6,9,24,.85);backdrop-filter:blur(10px);
  display:grid;place-items:center;padding:20px;z-index:9999;animation:tkFade .18s ease
}
.tk-modal-box{
  position:relative;background:rgba(255,255,255,.92);border-radius:20px;padding:12px;max-width:90vw;max-height:90vh;
  display:flex;flex-direction:column;align-items:center;box-shadow:0 24px 60px rgba(0,0,0,.5);
  border:1px solid rgba(139,92,246,.35)
}
body.dark .tk-modal-box, [data-theme="dark"] .tk-modal-box{background:rgba(15,23,42,.92)}
.tk-modal-box img{max-width:100%;max-height:76vh;border-radius:14px;object-fit:contain;display:block}
.tk-modal-caption{margin-top:12px;text-align:center;display:flex;flex-direction:column;gap:2px}
.tk-modal-caption strong{color:var(--navy);font-size:1.05rem}
body.dark .tk-modal-caption strong, [data-theme="dark"] .tk-modal-caption strong{color:#f8fafc}
.tk-modal-caption span{color:#6b7694;font-size:.88rem}
body.dark .tk-modal-caption span, [data-theme="dark"] .tk-modal-caption span{color:#94a3b8}
.tk-modal-close{
  position:absolute;top:-14px;right:-14px;width:36px;height:36px;border-radius:50%;
  border:none;background:linear-gradient(135deg,#06b6d4,#8b5cf6);color:#fff;font-size:1rem;font-weight:700;cursor:pointer;
  display:grid;place-items:center;box-shadow:0 4px 12px rgba(0,0,0,.35);transition:transform .15s ease
}
.tk-modal-close:hover{transform:scale(1.08)}
@keyframes tkFade{from{opacity:0}to{opacity:1}}

@media(max-width:900px){.tk-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.tk-grid{grid-template-columns:1fr}.tk-judul{font-size:1.65rem}}
`;