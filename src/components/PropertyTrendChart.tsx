import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PropertyTrendChart = () => {
  const data = [
    { month: 'Jan', occupancy: 92 },
    { month: 'Feb', occupancy: 94 },
    { month: 'Mar', occupancy: 91 },
    { month: 'Apr', occupancy: 95 },
    { month: 'May', occupancy: 97 },
    { month: 'Jun', occupancy: 96 },
  ]

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[85, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="occupancy" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PropertyTrendChart