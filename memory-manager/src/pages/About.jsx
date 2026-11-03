const ALGO = [
  ['FIFO (First In First Out)', 'Data yang paling pertama masuk ke memori adalah yang pertama dikeluarkan, seperti antrean di kasir. Sederhana, tetapi data penting yang sudah lama bisa ikut terbuang.'],
  ['LRU (Least Recently Used)', 'Data yang paling lama tidak dipakai akan dikeluarkan. Idenya: data yang baru dipakai kemungkinan akan dipakai lagi.'],
  ['Optimal', 'Data yang akan dipakai paling lama di masa depan (atau tidak dipakai lagi) dikeluarkan. Hasilnya terbaik, tetapi butuh mengetahui masa depan, sehingga dipakai sebagai pembanding teoritis.'],
]
const TERMS = [
  ['RAM', 'Memori utama komputer tempat data dan program yang sedang berjalan disimpan sementara.'],
  ['Frame', 'Slot atau kotak di RAM yang bisa menampung satu page.'],
  ['Page', 'Potongan data berukuran tetap yang diminta oleh program.'],
  ['Page Fault', 'Kejadian saat data yang diminta belum ada di memori sehingga harus dimasukkan.'],
  ['Hit', 'Kejadian saat data yang diminta sudah ada di memori.'],
  ['Page Replacement', 'Proses memilih data yang dikeluarkan ketika memori penuh agar data baru bisa masuk.'],
]
export default function About({ go }) {
  return (
    <section className="page">
      <h1>Tentang Aplikasi</h1>
      <div className="card"><h3>Tujuan</h3><p>Memory Manager dibuat sebagai proyek akhir mata kuliah Sistem Operasi untuk membantu siapa saja memahami pengelolaan memori, khususnya algoritma Page Replacement.</p>
        <h3>Pengelolaan Memori</h3><p>Memori komputer terbatas. Saat program meminta data yang belum ada di memori dan semua slot sudah terisi, sistem operasi harus memilih data yang diganti. Cara memilihnya disebut algoritma Page Replacement.</p></div>
      <div className="cards3">{ALGO.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
      <div className="card"><h3>Istilah Penting</h3><dl>{TERMS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl></div>
      <button className="btn btn-primary" onClick={() => go('simulasi')}>Coba Simulasi</button>
    </section>
  )
}
