import { useState } from "react";

const ANGGOTA = [
  { nama: "Chalisa Adelia Putri", npm: "257006111072", foto: "chalisa.jpeg", warna: "blue", posisi: "center 35%" },
  { nama: "Muhammad Faishal Akrom", npm: "257006111079", foto: "faishal.jpeg", warna: "green", posisi: "center 55%" },
  { nama: "Hilmi Juliansyah", npm: "257006111080", foto: "hilmi.jpeg", warna: "orange", posisi: "center 40%" },
  { nama: "Muhammad Alfaridzi Hudmawan", npm: "257006111085", foto: "alpa.jpeg", warna: "blue", posisi: "center 65%" },
  { nama: "Muhammad Fatan Labiha", npm: "257006111093", foto: "fatan.jpeg", warna: "green", posisi: "center 75%" },
  { nama: "Rakha Fauzan Nughraha", npm: "257006111083", foto: "rakha.jpg", warna: "orange", posisi: "center center" },
];

const inisial = (nama) =>
  nama.split(" ").filter(Boolean).slice(0, 2).map((k) => k[0]).join("").toUpperCase();

export default function AboutUs() {
  const [selectedFoto, setSelectedFoto] = useState(null);

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
            {a.foto ? (
              <div
                className="tk-foto-wrap"
                onClick={() => setSelectedFoto(a)}
                title="Klik untuk melihat foto penuh"
              >
                <img
                  className="tk-foto"
                  src={`/foto/${a.foto}`}
                  alt={`Foto ${a.nama}`}
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
              src={`/foto/${selectedFoto.foto}`}
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
  --navy:#12234a;--blue:#3b6fdc;--green:#10b981;--orange:#f59e0b;--ink:#2d3a5c;
  max-width:1106px;margin:0 auto;padding:28px 16px 60px;color:var(--ink);
  font-family:inherit
}
.tk-head{margin-bottom:24px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.tk-pill{
  display:inline-block;padding:5px 12px;border-radius:999px;font-size:.78rem;font-weight:700;
  letter-spacing:.02em;background:rgba(59,111,220,.12);color:var(--blue);margin-bottom:8px
}
.tk-judul{color:var(--navy);font-size:2rem;font-weight:800;margin:0;line-height:1.2}

.tk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.tk-card{background:#fff;border-radius:20px;box-shadow:0 4px 18px rgba(30,60,140,.08)}
.tk-member{
  padding:14px 14px 20px;border-top:5px solid var(--c);
  display:flex;flex-direction:column;gap:14px;
  transition:transform .22s ease, box-shadow .22s ease
}
.tk-member:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(30,60,140,.14)}
.tk-member.blue{--c:var(--blue)}
.tk-member.green{--c:var(--green)}
.tk-member.orange{--c:var(--orange)}

.tk-foto-wrap{
  width:100%;height:190px;border-radius:14px;overflow:hidden;
  cursor:zoom-in;background:#e8edf8;position:relative
}
.tk-foto{width:100%;height:100%;object-fit:cover;transition:transform .3s ease;display:block}
.tk-foto-wrap:hover .tk-foto{transform:scale(1.05)}
.tk-zoom-hint{
  position:absolute;right:10px;bottom:10px;padding:4px 10px;border-radius:999px;
  background:rgba(15,23,42,.68);color:#fff;font-size:.72rem;font-weight:600;
  opacity:0;transform:translateY(4px);transition:opacity .2s ease, transform .2s ease;
  backdrop-filter:blur(4px)
}
.tk-foto-wrap:hover .tk-zoom-hint{opacity:1;transform:translateY(0)}

.tk-avatar-wrap{width:100%;height:190px;border-radius:14px;background:#f1f5fb;display:grid;place-items:center}
.tk-avatar{
  width:64px;height:64px;border-radius:50%;background:var(--c);color:#fff;
  display:grid;place-items:center;font-weight:800;font-size:1.35rem
}

.tk-info{padding:0 6px;display:flex;flex-direction:column;gap:4px}
.tk-member h3{margin:0;color:var(--navy);font-size:1.06rem;font-weight:700;line-height:1.35}
.tk-nim{
  display:inline-flex;align-items:center;width:fit-content;
  font-size:.82rem;font-weight:600;color:#5b6785;
  background:#f2f5fc;padding:3px 9px;border-radius:8px;margin-top:2px
}

.tk-note{
  margin-top:32px;padding:14px 18px;border-radius:14px;
  background:#ebe8fb;color:var(--navy);line-height:1.5;font-size:.92rem
}

/* Dukungan Dark Mode otomatis mengikuti tema aplikasi */
body.dark .tk-judul, [data-theme="dark"] .tk-judul{color:#f1f5f9}
body.dark .tk-pill, [data-theme="dark"] .tk-pill{background:rgba(96,165,250,.18);color:#93c5fd}
body.dark .tk-card, [data-theme="dark"] .tk-card{background:#162033;box-shadow:0 6px 22px rgba(0,0,0,.35)}
body.dark .tk-member h3, [data-theme="dark"] .tk-member h3{color:#f8fafc}
body.dark .tk-nim, [data-theme="dark"] .tk-nim{background:#1e293b;color:#94a3b8}
body.dark .tk-note, [data-theme="dark"] .tk-note{background:#1e2640;color:#cbd5e1}

/* Modal Foto Penuh */
.tk-modal{
  position:fixed;inset:0;background:rgba(10,15,28,.85);backdrop-filter:blur(6px);
  display:grid;place-items:center;padding:20px;z-index:9999;animation:tkFade .18s ease
}
.tk-modal-box{
  position:relative;background:#fff;border-radius:20px;padding:12px;max-width:90vw;max-height:90vh;
  display:flex;flex-direction:column;align-items:center;box-shadow:0 24px 60px rgba(0,0,0,.5)
}
body.dark .tk-modal-box, [data-theme="dark"] .tk-modal-box{background:#162033}
.tk-modal-box img{max-width:100%;max-height:76vh;border-radius:14px;object-fit:contain;display:block}
.tk-modal-caption{margin-top:12px;text-align:center;display:flex;flex-direction:column;gap:2px}
.tk-modal-caption strong{color:var(--navy);font-size:1.05rem}
body.dark .tk-modal-caption strong, [data-theme="dark"] .tk-modal-caption strong{color:#f8fafc}
.tk-modal-caption span{color:#6b7694;font-size:.88rem}
body.dark .tk-modal-caption span, [data-theme="dark"] .tk-modal-caption span{color:#94a3b8}
.tk-modal-close{
  position:absolute;top:-14px;right:-14px;width:36px;height:36px;border-radius:50%;
  border:none;background:var(--navy);color:#fff;font-size:1rem;font-weight:700;cursor:pointer;
  display:grid;place-items:center;box-shadow:0 4px 12px rgba(0,0,0,.35);transition:background .15s ease
}
.tk-modal-close:hover{background:#ef4444}
@keyframes tkFade{from{opacity:0}to{opacity:1}}

@media(max-width:900px){.tk-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.tk-grid{grid-template-columns:1fr}.tk-judul{font-size:1.65rem}}
`;