import { useMemo } from 'react'
import { compareAll } from '../algorithms/index.js'
import ComparisonChart from '../components/ComparisonChart.jsx'
const f = (n) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`

function conclusion(data) {
  const min = Math.min(...data.map((d) => d.faults))
  const best = data.filter((d) => d.faults === min).map((d) => d.name)
  if (best.length === data.length) return 'Pada urutan data ini, ketiga algoritma menghasilkan jumlah Page Fault yang sama.'
  const others = data.filter((d) => d.faults !== min).map((d) => d.name)
  const verb = best.length > 1 ? 'menghasilkan' : 'menghasilkan'
  return `Pada urutan data ini, algoritma ${best.join(' dan ')} ${verb} Page Fault paling sedikit (${min}) dibandingkan ${others.join(' dan ')}.`
}

export default function Comparison({ config, go }) {
  const data = useMemo(() => compareAll(config.pages, config.cap), [config])
  return (
    <section className="page">
      <h1>Perbandingan Algoritma</h1>
      <p className="sub">Input: <b>{config.pages.join(', ')}</b> dengan <b>{config.cap} slot</b>. Ubah input di halaman Simulasi.</p>
      <div className="cards3">
        {data.map((d) => (
          <div className="card" key={d.key} style={{ borderTop: `5px solid ${d.color}` }}>
            <h3>{d.name}</h3>
            <p>Page Fault: <b>{d.faults}</b> ({f(d.faultRatio)})</p>
            <p>Hit: <b>{d.hits}</b> ({f(d.hitRatio)})</p>
          </div>
        ))}
      </div>
      <div className="card"><h3>Grafik Page Fault</h3><ComparisonChart data={data} /></div>
      <div className="alert info"><b>Kesimpulan:</b> {conclusion(data)}</div>
      <button className="btn btn-primary" onClick={() => go('simulasi')}>Ubah Input Simulasi</button>
    </section>
  )
}
