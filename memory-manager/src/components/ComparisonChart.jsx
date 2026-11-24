import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ComparisonChart({ data }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontWeight: 600 }} />
          <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <Tooltip
            cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(139, 92, 246, 0.4)',
              borderRadius: '12px',
              color: '#f8fafc',
              backdropFilter: 'blur(12px)',
            }}
          />
          <Bar dataKey="faults" name="Page Fault" radius={[10, 10, 0, 0]} animationDuration={600}>
            {data.map((d) => <Cell key={d.key} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}