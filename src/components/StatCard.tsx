import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  title: string
  value: string
  change: string
  negative?: boolean
}

const StatCard = ({ icon, title, value, change, negative = false }: StatCardProps) => {
  return (
    <div className="glass glass-hover p-6">
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-lg bg-blue-500/20">
          {icon}
        </div>
        <span className={`px-2 py-1 rounded-full text-sm ${
          negative ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
        }`}>
          {change}%
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
    </div>
  )
}

export default StatCard