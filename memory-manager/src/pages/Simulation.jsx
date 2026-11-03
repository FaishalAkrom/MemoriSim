import { useEffect, useState } from 'react'
import { Pause, Play, StepBack, StepForward } from 'lucide-react'
import { ALGORITHMS, parseInput, summarize } from '../algorithms/index.js'
import SimulationControls from '../components/SimulationControls.jsx'
import MemorySlots from '../components/MemorySlots.jsx'
import StepHistory from '../components/StepHistory.jsx'
import ResultCard from '../components/ResultCard.jsx'

export default function Simulation({ config, setConfig }) {
  const [cap, setCap] = useState(config.cap)
  const [text, setText] = useState(config.text)
  const [algo, setAlgo] = useState('FIFO')
  const [error, setError] = useState('')
  const [run, setRun] = useState(null) // { steps, cap, algo }
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  const last = run ? run.steps.length - 1 : 0
  useEffect(() => {
    if (!playing) return
    if (idx >= last) { setPlaying(false); return }
    const t = setTimeout(() => setIdx((i) => i + 1), 1100)
    return () => clearTimeout(t)
  }, [playing, idx, last])

  const onRun = () => {
    const { pages, error: err } = parseInput(text)
    if (err) { setError(err); return }
    setError('')
    setConfig({ cap, text, pages })
    setRun({ steps: ALGORITHMS[algo].run(pages, cap), cap, algo })
    setIdx(0); setPlaying(false)
  }
  const onReset = () => { setRun(null); setIdx(0); setPlaying(false); setError(''); setText('1, 2, 3, 1, 4, 1, 2, 5'); setCap(3); setAlgo('FIFO') }

  const step = run ? run.steps[idx] : null
  const done = run && idx === last
  const result = run ? summarize(run.steps.slice(0, idx + 1)) : null
  return (
    <section className="page">
      <h1>Simulasi Pengelolaan Memori</h1>
      <p className="sub">Lihat bagaimana komputer memilih data saat memori penuh!</p>
      <SimulationControls {...{ cap, setCap, text, setText, algo, setAlgo, error, onRun, onReset }} />
      {!run ? (
        <div className="alert info">Atur pengaturan di atas lalu tekan <b>Jalankan Simulasi</b> untuk memulai.</div>
      ) : (
        <div className="grid2">
          <StepHistory steps={run.steps} idx={idx} onSelect={(i) => { setIdx(i); setPlaying(false) }} />
          <div className="stack">
            <div className="card">
              <h3>Kondisi Memori Saat Ini — {ALGORITHMS[run.algo].label}</h3>
              <p className="req">Langkah {step.step} dari {run.steps.length} · Data diminta: <b>{step.page}</b></p>
              <MemorySlots step={step} cap={run.cap} />
              <div className={'alert ' + (step.hit ? 'success' : 'fault')}>
                <b>{step.hit ? 'HIT' : 'PAGE FAULT'}:</b> {step.explanation}
              </div>
              <div className="row center">
                <button className="btn btn-ghost" disabled={idx === 0} onClick={() => { setIdx(idx - 1); setPlaying(false) }}><StepBack size={16} /> Sebelumnya</button>
                {playing
                  ? <button className="btn btn-primary" onClick={() => setPlaying(false)}><Pause size={16} /> Jeda</button>
                  : <button className="btn btn-primary" onClick={() => { if (done) setIdx(0); setPlaying(true) }}><Play size={16} /> Putar Otomatis</button>}
                <button className="btn btn-ghost" disabled={done} onClick={() => { setIdx(idx + 1); setPlaying(false) }}>Berikutnya <StepForward size={16} /></button>
              </div>
            </div>
            {done
              ? <ResultCard label={ALGORITHMS[run.algo].label} result={result} />
              : <div className="alert info">Hasil akhir akan muncul setelah langkah terakhir ({run.steps.length}) ditampilkan.</div>}
          </div>
        </div>
      )}
    </section>
  )
}
