import { ArrowRight, RotateCcw } from 'lucide-react'
import { ALGORITHMS } from '../algorithms/index.js'
export default function SimulationControls({ cap, setCap, text, setText, algo, setAlgo, error, onRun, onReset }) {
  return (
    <div className="card">
      <h3>Pengaturan Simulasi</h3>
      <div className="form">
        <label>Jumlah Slot Memori
          <select value={cap} onChange={(e) => setCap(Number(e.target.value))}>
            {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} Slot</option>)}
          </select>
        </label>
        <label className="grow">Urutan Data yang Diminta
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="1, 2, 3, 1, 4, 1, 2, 5" />
          <small>Pisahkan dengan koma. Contoh: 1, 2, 3, 1, 4, 1, 2, 5</small>
        </label>
        <div>
          <span className="lbl">Pilih Algoritma</span>
          <div className="pills">
            {Object.keys(ALGORITHMS).map((k) => (
              <button key={k} className={'pill' + (algo === k ? ' on' : '')} onClick={() => setAlgo(k)}>{ALGORITHMS[k].label}</button>
            ))}
          </div>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="row">
        <button className="btn btn-primary" onClick={onRun}>Jalankan Simulasi <ArrowRight size={16} /></button>
        <button className="btn btn-ghost" onClick={onReset}><RotateCcw size={16} /> Reset</button>
      </div>
    </div>
  )
}
