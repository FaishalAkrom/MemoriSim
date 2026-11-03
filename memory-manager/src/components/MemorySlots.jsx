// Menampilkan slot memori pada langkah tertentu. Warna: baru (hijau), pengganti (kuning), tetap (biru).
export default function MemorySlots({ step, cap }) {
  const mem = step ? step.memory : Array(cap).fill(null)
  return (
    <div>
      <div className="slots">
        {mem.map((v, i) => {
          let cls = 'slot'
          let tag = 'Tetap'
          if (v === null) { cls += ' empty'; tag = 'Kosong' }
          else if (step && step.slot === i && !step.hit) {
            cls += step.evicted !== null ? ' replaced' : ' fresh'
            tag = step.evicted !== null ? `Gantikan ${step.evicted}` : 'Baru'
          } else if (step && step.hit && step.slot === i) { cls += ' hit'; tag = 'Hit' }
          return (
            <div className="slot-wrap" key={i}>
              <div key={`${step ? step.step : 0}-${v}`} className={cls}>{v === null ? '–' : v}</div>
              <small>Slot {i + 1} · {tag}</small>
            </div>
          )
        })}
      </div>
      <div className="legend">
        <span><i className="dot fresh" />Data baru</span><span><i className="dot replaced" />Data pengganti</span><span><i className="dot keep" />Tetap di memori</span>
      </div>
    </div>
  )
}
