import { AlertCircle, CheckCircle2, PieChart, Trophy } from 'lucide-react'
const f = (n) => `${Number.isInteger(n) ? n : n.toFixed(1)}%`
export default function ResultCard({ label, result }) {
  return (
    <div className="card">
      <h3><Trophy size={20} /> Hasil Simulasi {label}</h3>
      <div className="stats">
        <div><AlertCircle size={18} className="bad" /><span>Page Fault</span><b>{result.faults}</b><small>Data yang harus dimasukkan karena belum ada</small></div>
        <div><CheckCircle2 size={18} className="ok" /><span>Hit</span><b>{result.hits}</b><small>Data sudah tersedia di memori</small></div>
        <div><PieChart size={18} /><span>Rasio Page Fault</span><b>{f(result.faultRatio)}</b><small>Rasio Hit: {f(result.hitRatio)}</small></div>
      </div>
      <div className="alert info"><b>Kesimpulan:</b> Algoritma {label} menghasilkan {result.faults} page fault dan {result.hits} hit dari {result.total} permintaan data.</div>
    </div>
  )
}
