import { Download, Table } from 'lucide-react'

export default function MemoryMatrix({ steps, cap, currentIdx, onSelect, algoName }) {
  if (!steps || steps.length === 0) return null

  const handleDownloadCSV = () => {
    const headers = ['Langkah', ...steps.map((s) => `t${s.step}`)].join(',')
    const pages = ['Data Diminta', ...steps.map((s) => s.page)].join(',')
    const slotRows = Array.from({ length: cap }).map((_, slotIdx) => {
      return [`Slot ${slotIdx + 1}`, ...steps.map((s) => (s.memory[slotIdx] !== null ? s.memory[slotIdx] : '-'))].join(',')
    })
    const statusRow = ['Status', ...steps.map((s) => (s.hit ? 'HIT' : 'FAULT'))].join(',')

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, pages, ...slotRows, statusRow].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `simulasi_${algoName || 'memori'}_matrix.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="card matrix-card">
      <div className="matrix-header">
        <div>
          <h3><Table size={20} className="accent" /> Tabel Matriks Alokasi Memori (Memory Trace Matrix)</h3>
          <p className="sub" style={{ margin: 0 }}>
            Visualisasi alokasi setiap slot frame sepanjang waktu. Klik kolom langkah mana saja untuk berpindah animasi.
          </p>
        </div>
        <div className="matrix-actions">
          <div className="legend" style={{ margin: 0 }}>
            <span><i className="dot hit" />Hit</span>
            <span><i className="dot fresh" />Data baru</span>
            <span><i className="dot replaced" />Pengganti</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleDownloadCSV} title="Unduh data tabel dalam format CSV">
            <Download size={14} /> Unduh CSV
          </button>
        </div>
      </div>

      <div className="matrix-scroll">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="sticky-col">Langkah (t)</th>
              {steps.map((s, i) => (
                <th
                  key={i}
                  className={`step-th ${i === currentIdx ? 'active-col' : ''}`}
                  onClick={() => onSelect && onSelect(i)}
                  title={`Klik untuk melihat detail langkah t${s.step}`}
                  style={{ cursor: 'pointer' }}
                >
                  t{s.step}
                </th>
              ))}
            </tr>
            <tr className="sub-header-row">
              <th className="sticky-col">Data Diminta</th>
              {steps.map((s, i) => (
                <th
                  key={i}
                  className={`page-th ${i === currentIdx ? 'active-col' : ''}`}
                  onClick={() => onSelect && onSelect(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="matrix-page-badge">{s.page}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: cap }).map((_, slotIdx) => (
              <tr key={slotIdx}>
                <td className="sticky-col">Slot {slotIdx + 1}</td>
                {steps.map((s, i) => {
                  const val = s.memory[slotIdx]
                  const isCurrent = i === currentIdx
                  const isTargetSlot = s.slot === slotIdx

                  let cellClass = 'matrix-cell'
                  let tag = ''
                  if (val === null) {
                    cellClass += ' cell-empty'
                  } else if (isTargetSlot && !s.hit) {
                    cellClass += s.evicted !== null ? ' cell-replaced' : ' cell-fresh'
                    tag = s.evicted !== null ? ` (menggantikan ${s.evicted})` : ' (baru)'
                  } else if (isTargetSlot && s.hit) {
                    cellClass += ' cell-hit'
                    tag = ' (hit)'
                  } else {
                    cellClass += ' cell-keep'
                  }

                  if (isCurrent) cellClass += ' active-col'

                  return (
                    <td
                      key={i}
                      className={cellClass}
                      onClick={() => onSelect && onSelect(i)}
                      title={`Langkah ${s.step}: Slot ${slotIdx + 1} = ${val !== null ? val : 'Kosong'}${tag}`}
                    >
                      {val === null ? '–' : val}
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="status-row">
              <td className="sticky-col">Status</td>
              {steps.map((s, i) => {
                const isCurrent = i === currentIdx
                return (
                  <td
                    key={i}
                    className={`status-cell ${isCurrent ? 'active-col' : ''}`}
                    onClick={() => onSelect && onSelect(i)}
                    style={{ cursor: 'pointer' }}
                    title={`Langkah ${s.step}: ${s.hit ? 'HIT (data sudah di RAM)' : 'PAGE FAULT (data harus diambil ke RAM)'}`}
                  >
                    <span className={`status-pill ${s.hit ? 'hit' : 'fault'}`}>
                      {s.hit ? 'HIT' : 'FAULT'}
                    </span>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
