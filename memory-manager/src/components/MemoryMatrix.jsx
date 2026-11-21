import { Download, Image as ImageIcon, Table } from 'lucide-react'

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

  // FUNGSI BARU: Render tabel matriks langsung menjadi gambar PNG berkualitas tinggi
  const handleDownloadPNG = () => {
    const scale = 2 // Resolusi HD (2x) agar teks tajam saat dimasukkan ke laporan Word/PDF
    const labelW = 130
    const colW = 56
    const headerH = 65
    const rowH = 42
    const footerH = 45

    const totalRows = cap + 3 // Header t, Header Data, Slot 1..cap, Status
    const width = labelW + steps.length * colW + 40
    const height = headerH + totalRows * rowH + footerH

    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)

    // Latar belakang putih bersih
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    const startX = 20
    const startY = headerH

    // Judul & Ringkasan Statistik di bagian atas gambar
    const hits = steps.filter((s) => s.hit).length
    const faults = steps.length - hits
    ctx.fillStyle = '#14284b'
    ctx.font = 'bold 18px "Segoe UI", sans-serif'
    ctx.fillText(`Matriks Simulasi Memori — Algoritma ${algoName || ''}`, startX, 30)

    ctx.fillStyle = '#4a5d85'
    ctx.font = '13px "Segoe UI", sans-serif'
    ctx.fillText(`Kapasitas: ${cap} Frame  |  Total Langkah: ${steps.length}  |  Hit: ${hits}  |  Page Fault: ${faults}`, startX, 50)

    // Helper menggambar sel tabel
    const drawCell = (x, y, w, h, bg, text, textColor, isBold = false, isPill = false) => {
      ctx.fillStyle = bg
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = '#d6e0f5'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, w, h)

      if (isPill) {
        ctx.fillStyle = text === 'HIT' ? '#10b981' : '#ef4444'
        ctx.beginPath()
        ctx.roundRect(x + 6, y + 10, w - 12, h - 20, 10)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 10px "Segoe UI", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, x + w / 2, y + h / 2)
        return
      }

      ctx.fillStyle = textColor
      ctx.font = `${isBold ? 'bold ' : ''}13px "Segoe UI", sans-serif`
      ctx.textAlign = x === startX ? 'left' : 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(text), x === startX ? x + 12 : x + w / 2, y + h / 2)
    }

    // Baris 0: Langkah (t1, t2, ...)
    drawCell(startX, startY, labelW, rowH, '#e8efff', 'Langkah (t)', '#14284b', true)
    steps.forEach((s, i) => {
      drawCell(startX + labelW + i * colW, startY, colW, rowH, '#e8efff', `t${s.step}`, '#14284b', true)
    })

    // Baris 1: Data Diminta
    const yPage = startY + rowH
    drawCell(startX, yPage, labelW, rowH, '#f4f7ff', 'Data Diminta', '#14284b', true)
    steps.forEach((s, i) => {
      drawCell(startX + labelW + i * colW, yPage, colW, rowH, '#f4f7ff', s.page, '#3b6fe0', true)
    })

    // Baris Slot Memori (Slot 1 .. Slot N)
    for (let slotIdx = 0; slotIdx < cap; slotIdx++) {
      const ySlot = startY + (slotIdx + 2) * rowH
      drawCell(startX, ySlot, labelW, rowH, '#ffffff', `Slot ${slotIdx + 1}`, '#14284b', true)

      steps.forEach((s, i) => {
        const val = s.memory[slotIdx]
        const isTarget = s.slot === slotIdx
        let bg = '#ffffff'
        let color = '#14284b'
        let bold = false

        if (val === null) {
          bg = '#fafbff'
          color = '#9aa9c9'
        } else if (isTarget && !s.hit) {
          bg = s.evicted !== null ? '#ffe3a3' : '#bff0d6'
          color = s.evicted !== null ? '#92400e' : '#065f46'
          bold = true
        } else if (isTarget && s.hit) {
          bg = '#bff0d6'
          color = '#065f46'
          bold = true
        }

        drawCell(startX + labelW + i * colW, ySlot, colW, rowH, bg, val === null ? '–' : val, color, bold)
      })
    }

    // Baris Terakhir: Status (HIT / FAULT)
    const yStatus = startY + (cap + 2) * rowH
    drawCell(startX, yStatus, labelW, rowH, '#f8faff', 'Status', '#14284b', true)
    steps.forEach((s, i) => {
      drawCell(startX + labelW + i * colW, yStatus, colW, rowH, '#ffffff', s.hit ? 'HIT' : 'FAULT', '#ffffff', true, true)
    })

    // Keterangan Warna (Legend) di bagian bawah gambar
    const yLegend = yStatus + rowH + 15
    ctx.textAlign = 'left'
    ctx.font = '12px "Segoe UI", sans-serif'
    const legends = [
      { color: '#bff0d6', label: 'Hijau: Hit / Data Baru Masuk' },
      { color: '#ffe3a3', label: 'Kuning: Data Menggantikan Slot Lama' },
    ]
    let lx = startX
    legends.forEach((item) => {
      ctx.fillStyle = item.color
      ctx.fillRect(lx, yLegend, 14, 14)
      ctx.strokeStyle = '#cbd5e1'
      ctx.strokeRect(lx, yLegend, 14, 14)
      ctx.fillStyle = '#4a5d85'
      ctx.fillText(item.label, lx + 20, yLegend + 7)
      lx += 230
    })

    // Unduh file PNG
    const link = document.createElement('a')
    link.download = `matriks_${(algoName || 'memori').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
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
          <button className="btn btn-primary btn-sm" onClick={handleDownloadPNG} title="Simpan tabel matriks sebagai gambar PNG">
            <ImageIcon size={14} /> Unduh PNG
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