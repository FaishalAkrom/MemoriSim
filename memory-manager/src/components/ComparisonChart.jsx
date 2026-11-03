import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
export default function ComparisonChart({ data }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" /><YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="faults" name="Page Fault" radius={[8, 8, 0, 0]} animationDuration={600}>
            {data.map((d) => <Cell key={d.key} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
