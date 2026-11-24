import { useState, useEffect, useMemo } from "react";

const BUKU = [
  { id: 1, judul: "Sistem Operasi", kode: "1", warna: "#10b981", ikon: "💻" },
  { id: 2, judul: "Basis Data", kode: "2", warna: "#06b6d4", ikon: "🗄️" },
  { id: 3, judul: "Algoritma", kode: "3", warna: "#8b5cf6", ikon: "🧩" },
  { id: 4, judul: "Jaringan", kode: "4", warna: "#ec4899", ikon: "🌐" },
  { id: 5, judul: "Kalkulus", kode: "5", warna: "#3b82f6", ikon: "📐" },
];

const JADWAL_BELAJAR = [1, 2, 3, 1, 4, 2, 5, 1];

function prosesLangkah(urutan, kapasitas, algoritma) {
  let meja = [];
  return urutan.map((id, idx) => {
    const buku = BUKU.find((b) => b.id === id);
    const adaDiMeja = meja.findIndex((m) => m.id === id);

    let status = "HIT";
    let bukuKeluar = null;
    let cerita = "";

    if (adaDiMeja !== -1) {
      status = "HIT";
      meja[adaDiMeja] = { ...meja[adaDiMeja], terakhirBaca: idx };
      cerita = `Buku "${buku.judul}" sudah ada di meja. Tinggal langsung dibaca! (Tidak perlu ke rak buku)`;
    } else {
      status = "FAULT";
      if (meja.length < kapasitas) {
        meja.push({ id, masukKe: idx, terakhirBaca: idx });
        cerita = `Buku "${buku.judul}" belum ada di meja. Kamu ambil dari rak dan taruh di meja yang masih kosong.`;
      } else {
        let korban = 0;
        if (algoritma === "FIFO") {
          meja.forEach((m, i) => {
            if (m.masukKe < meja[korban].masukKe) korban = i;
          });
          bukuKeluar = BUKU.find((b) => b.id === meja[korban].id);
          cerita = `Meja penuh! Aturan FIFO: buku "${bukuKeluar.judul}" dikembalikan ke rak karena paling pertama ditaruh di meja, diganti "${buku.judul}".`;
        } else if (algoritma === "LRU") {
          meja.forEach((m, i) => {
            if (m.terakhirBaca < meja[korban].terakhirBaca) korban = i;
          });
          bukuKeluar = BUKU.find((b) => b.id === meja[korban].id);
          cerita = `Meja penuh! Aturan LRU: buku "${bukuKeluar.judul}" dikembalikan ke rak karena paling lama tidak disentuh/dibaca, diganti "${buku.judul}".`;
        } else {
          let terjauh = -1;
          meja.forEach((m, i) => {
            const posisiNanti = urutan.slice(idx + 1).indexOf(m.id);
            const jarak = posisiNanti === -1 ? 999 : posisiNanti;
            if (jarak > terjauh) {
              terjauh = jarak;
              korban = i;
            }
          });
          bukuKeluar = BUKU.find((b) => b.id === meja[korban].id);
          cerita = `Meja penuh! Aturan Optimal: buku "${bukuKeluar.judul}" dikembalikan ke rak karena paling lama baru akan dipakai lagi nanti, diganti "${buku.judul}".`;
        }
        meja[korban] = { id, masukKe: idx, terakhirBaca: idx };
      }
    }

    return {
      no: idx + 1,
      buku,
      status,
      bukuKeluar,
      cerita,
      isiMeja: meja.map((m) => BUKU.find((b) => b.id === m.id)),
    };
  });
}

export default function StudyDesk() {
  const [algoritma, setAlgoritma] = useState("LRU");
  const [step, setStep] = useState(0);
  const [jalan, setJalan] = useState(false);

  const hasil = useMemo(() => prosesLangkah(JADWAL_BELAJAR, 3, algoritma), [algoritma]);
  const aktif = hasil[step];

  useEffect(() => {
    if (!jalan) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= hasil.length - 1) {
          setJalan(false);
          return s;
        }
        return s + 1;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [jalan, hasil.length]);

  const totalBolakBalik = hasil.slice(0, step + 1).filter((h) => h.status === "FAULT").length;

  return (
    <section className="simple-desk">
      <style>{css}</style>

      {/* 1. HEADER & PILIHAN ATURAN */}
      <div className="sd-head">
        <div>
          <h2>Analogi Meja Belajar & Rak Buku</h2>
          <p>Meja belajar (RAM) cuma muat <strong>3 buku</strong>. Sisa buku disimpan di rak (Storage).</p>
        </div>

        <div className="sd-tabs">
          {[
            { id: "FIFO", label: "FIFO (Paling Awal Ditaruh)" },
            { id: "LRU", label: "LRU (Paling Lama Tak Dibaca)" },
            { id: "OPTIMAL", label: "Optimal (Intip Jadwal)" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={algoritma === item.id ? "active" : ""}
              onClick={() => {
                setAlgoritma(item.id);
                setStep(0);
                setJalan(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. URUTAN BUKU YANG DIBUTUHKAN */}
      <div className="sd-queue">
        <span>Urutan belajar:</span>
        {hasil.map((h, i) => (
          <button
            key={i}
            type="button"
            className={`q-item ${i === step ? "now" : ""}`}
            onClick={() => {
              setStep(i);
              setJalan(false);
            }}
          >
            {h.buku.ikon} {h.buku.judul}
          </button>
        ))}
      </div>

      {/* 3. MEJA BELAJAR & RAK BUKU (LANGSUNG TERLIHAT SEJAJAR) */}
      <div className="sd-board">
        {/* Meja Belajar */}
        <div className="sd-box">
          <div className="sd-box-title">
            <h3>🪑 Meja Belajar (Maks. 3 Buku)</h3>
            <span className={`tag ${aktif.status === "HIT" ? "hit" : "fault"}`}>
              {aktif.status === "HIT" ? "✓ Sudah di Meja (Hit)" : "✕ Ambil dari Rak (Fault)"}
            </span>
          </div>

          <div className="sd-slots">
            {[0, 1, 2].map((i) => {
              const b = aktif.isiMeja[i];
              return (
                <div
                  key={i}
                  className={`slot ${b ? "isi" : ""}`}
                  style={b ? { borderColor: b.warna } : undefined}
                >
                  {b ? (
                    <>
                      <span className="ico">{b.ikon}</span>
                      <strong>{b.judul}</strong>
                    </>
                  ) : (
                    <span className="kosong">Kosong</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rak Buku */}
        <div className="sd-box">
          <h3>📚 Rak Buku (Lemari)</h3>
          <div className="sd-shelf">
            {BUKU.map((b) => {
              const diMeja = aktif.isiMeja.some((m) => m.id === b.id);
              const dikembalikan = aktif.bukuKeluar?.id === b.id;
              return (
                <div
                  key={b.id}
                  className={`shelf-row ${diMeja ? "di-meja" : ""} ${dikembalikan ? "balik" : ""}`}
                >
                  <span>{b.ikon} {b.judul}</span>
                  <small>
                    {dikembalikan ? "Dikembalikan ke rak!" : diMeja ? "Ada di meja" : "Di rak"}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. CERITA PENJELASAN */}
      <div className={`sd-story ${aktif.status === "HIT" ? "hit" : "fault"}`}>
        <strong>Langkah {aktif.no} dari {hasil.length}:</strong> {aktif.cerita}
      </div>

      {/* 5. TOMBOL KONTROL BAWAH */}
      <div className="sd-foot">
        <div className="sd-btns">
          <button type="button" disabled={step === 0} onClick={() => { setJalan(false); setStep(step - 1); }}>
            ◀ Sebelumnya
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              if (step >= hasil.length - 1) setStep(0);
              setJalan(!jalan);
            }}
          >
            {jalan ? "⏸ Jeda" : "▶ Putar Otomatis"}
          </button>
          <button type="button" disabled={step === hasil.length - 1} onClick={() => { setJalan(false); setStep(step + 1); }}>
            Lanjut ▶
          </button>
        </div>

        <div className="sd-score">
          Total bolak-balik ke rak buku (Page Fault): <strong>{totalBolakBalik} kali</strong>
        </div>
      </div>
    </section>
  );
}

const css = `
.simple-desk {
  max-width: 1050px;
  margin: 12px auto;
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.18);
  color: #0f172a;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.08);
}
body.dark .simple-desk, [data-theme="dark"] .simple-desk {
  background: rgba(15, 23, 42, 0.62) !important;
  border-color: rgba(148, 163, 184, 0.16) !important;
  color: #f8fafc;
}

.sd-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.sd-head h2 { margin: 0 0 4px; font-size: 1.45rem; }
.sd-head p { margin: 0; font-size: 0.92rem; color: #475569; }
body.dark .sd-head p, [data-theme="dark"] .sd-head p { color: #94a3b8; }

.sd-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
.sd-tabs button {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(99, 102, 241, 0.22);
  background: rgba(255, 255, 255, 0.8);
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  color: #334155;
  transition: all 0.2s ease;
}
body.dark .sd-tabs button, [data-theme="dark"] .sd-tabs button {
  background: rgba(23, 33, 61, 0.75);
  border-color: rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
}
.sd-tabs button.active {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%) !important;
  border-color: transparent !important;
  color: #ffffff !important;
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.35);
}

.sd-queue {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  font-size: 0.85rem;
  font-weight: 700;
}
.q-item {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(99, 102, 241, 0.22);
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 0.82rem;
  color: #334155;
  transition: all 0.2s ease;
}
body.dark .q-item, [data-theme="dark"] .q-item {
  background: rgba(23, 33, 61, 0.75);
  border-color: rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
}
.q-item.now {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%) !important;
  border-color: transparent !important;
  color: #ffffff !important;
  transform: scale(1.05);
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.35);
}

.sd-board {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.sd-box {
  padding: 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(99, 102, 241, 0.16);
}
body.dark .sd-box, [data-theme="dark"] .sd-box {
  background: rgba(10, 15, 32, 0.65);
  border-color: rgba(148, 163, 184, 0.16);
}
.sd-box-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.sd-box h3 { margin: 0 0 12px; font-size: 1rem; }
.sd-box-title h3 { margin: 0; }

.tag { padding: 4px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; }
.tag.hit { background: rgba(16, 185, 129, 0.18); color: #059669; border: 1px solid rgba(16, 185, 129, 0.35); }
.tag.fault { background: rgba(139, 92, 246, 0.18); color: #7c3aed; border: 1px solid rgba(139, 92, 246, 0.35); }
body.dark .tag.hit, [data-theme="dark"] .tag.hit { color: #6ee7b7; }
body.dark .tag.fault, [data-theme="dark"] .tag.fault { color: #d8b4fe; }

.sd-slots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.sd-slots .slot {
  width: 100%;
  height: 135px;
  border-radius: 14px;
  border: 2px dashed rgba(148, 163, 184, 0.45);
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 10px;
}
body.dark .sd-slots .slot, [data-theme="dark"] .sd-slots .slot {
  background: rgba(15, 23, 42, 0.7) !important;
  border-color: rgba(148, 163, 184, 0.25);
}
.sd-slots .slot.isi { border-style: solid; border-width: 2.5px; }
.sd-slots .slot .ico { font-size: 2.2rem; }
.sd-slots .slot strong { font-size: 0.92rem; }
.sd-slots .slot .kosong { color: #94a3b8; font-size: 0.85rem; }

.sd-shelf { display: flex; flex-direction: column; gap: 7px; }
.shelf-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(99, 102, 241, 0.16);
  font-size: 0.85rem;
}
body.dark .shelf-row, [data-theme="dark"] .shelf-row {
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(148, 163, 184, 0.16);
}
.shelf-row.di-meja { opacity: 0.45; text-decoration: line-through; }
.shelf-row.balik {
  border-color: #a855f7;
  background: rgba(139, 92, 246, 0.16);
  color: #7c3aed;
  font-weight: 700;
}
body.dark .shelf-row.balik, [data-theme="dark"] .shelf-row.balik {
  background: rgba(139, 92, 246, 0.22);
  color: #e9d5ff;
}

.sd-story {
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 16px;
}
.sd-story.hit { background: rgba(16, 185, 129, 0.14); border-left: 5px solid #10b981; color: #065f46; }
.sd-story.fault { background: rgba(139, 92, 246, 0.14); border-left: 5px solid #8b5cf6; color: #5b21b6; }
body.dark .sd-story.hit, [data-theme="dark"] .sd-story.hit { background: rgba(16, 185, 129, 0.18); color: #a7f3d0; }
body.dark .sd-story.fault, [data-theme="dark"] .sd-story.fault { background: rgba(139, 92, 246, 0.2); color: #e9d5ff; }

.sd-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.sd-btns { display: flex; gap: 8px; }
.sd-btns button {
  padding: 9px 15px;
  border-radius: 999px;
  border: 1px solid rgba(99, 102, 241, 0.24);
  background: rgba(255, 255, 255, 0.8);
  font-weight: 700;
  cursor: pointer;
}
body.dark .sd-btns button, [data-theme="dark"] .sd-btns button {
  background: rgba(23, 33, 61, 0.78);
  border-color: rgba(148, 163, 184, 0.2);
  color: #f8fafc;
}
.sd-btns button:disabled { opacity: 0.4; cursor: not-allowed; }
.sd-btns button.primary {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%) !important;
  border-color: transparent !important;
  color: #ffffff !important;
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.35);
}
.sd-score { font-size: 0.92rem; }

@media (max-width: 768px) {
  .sd-board { grid-template-columns: 1fr; }
}
`;