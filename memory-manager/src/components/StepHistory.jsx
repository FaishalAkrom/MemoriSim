export default function StepHistory({ steps, idx, onSelect }) {
  return (
    <div className="card">
      <h3>Langkah demi Langkah</h3>
      <ol className="history">
        {steps.map((s, i) => (
          <li key={i} className={(i === idx ? 'current ' : '') + (i > idx ? 'future' : '')} onClick={() => onSelect(i)}>
            <b className={s.hit ? 'ok' : 'bad'}>{s.step}</b>
            <span>{s.explanation}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
