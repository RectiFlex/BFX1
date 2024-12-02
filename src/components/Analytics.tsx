import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Property } from '../types/property'
import { Personnel } from '../types/personnel'
import { WorkOrder } from '../types/workOrder'

type TimeRange = '6m' | '1y' | 'all'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6m')
  const [maintenanceData, setMaintenanceData] = useState<{ month: string; count: number }[]>([])
  const [contractorData, setContractorData] = useState<{
    name: string;
    rating: number;
    jobs: number;
  }[]>([])

  useEffect(() => {
    const loadData = () => {
      // Load work orders from localStorage
      const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
      const personnel: Personnel[] = JSON.parse(localStorage.getItem('personnel') || '[]')

      // Calculate date range based on selected time range
      const now = new Date()
      const rangeStart = new Date(now)
      switch (timeRange) {
        case '6m':
          rangeStart.setMonth(now.getMonth() - 6)
          break
        case '1y':
          rangeStart.setFullYear(now.getFullYear() - 1)
          break
        case 'all':
          rangeStart.setFullYear(2000) // Effectively all data
          break
      }

      // Filter work orders within the date range
      const filteredOrders = workOrders.filter(order => 
        new Date(order.createdAt) >= rangeStart
      )

      // Process maintenance trends
      const monthlyData = new Map<string, number>()
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt)
        const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1)
      })

      // Convert to array and sort chronologically
      const maintenanceTrends = Array.from(monthlyData.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => {
          const [monthA, yearA] = a.month.split(' ')
          const [monthB, yearB] = b.month.split(' ')
          return new Date(`${monthA} 20${yearA}`).getTime() - new Date(`${monthB} 20${yearB}`).getTime()
        })

      // Process contractor performance
      const contractors = personnel.filter(p => p.role === 'contractor')
      const contractorPerformance = contractors.map(contractor => {
        const contractorOrders = workOrders.filter(order => 
          order.assignedTo === `${contractor.firstName} ${contractor.lastName}` &&
          order.status === 'completed'
        )
        
        return {
          name: `${contractor.firstName} ${contractor.lastName}`,
          rating: contractor.rating,
          jobs: contractorOrders.length
        }
      }).sort((a, b) => b.jobs - a.jobs)

      setMaintenanceData(maintenanceTrends)
      setContractorData(contractorPerformance)
    }

    loadData()
  }, [timeRange])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select 
          className="glass glass-hover px-4 py-2 bg-transparent"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
        >
          <option value="6m">Last 6 months</option>
          <option value="1y">Last year</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-6">Maintenance Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Contractor Performance</h2>
          <div className="space-y-4">
            {contractorData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No contractor data available</p>
            ) : (
              contractorData.map((contractor) => (
                <div key={contractor.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="font-medium">{contractor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${
                            i < Math.floor(contractor.rating) ? 'text-yellow-400' : 'text-gray-600'
                          }`}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">({contractor.rating.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Completed Jobs</p>
                    <p className="font-medium">{contractor.jobs}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400">Average Response Time</p>
              <p className="text-2xl font-semibold mt-1">
                {calculateAverageResponseTime()} hrs
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400">Completion Rate</p>
              <p className="text-2xl font-semibold mt-1">
                {calculateCompletionRate()}%
              </p>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Cost Analysis</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400">Average Cost per Job</p>
              <p className="text-2xl font-semibold mt-1">
                ${calculateAverageCost()}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400">Total Spending</p>
              <p className="text-2xl font-semibold mt-1">
                ${calculateTotalSpending()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility functions for calculations
const calculateAverageResponseTime = (): string => {
  const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
  const responseTimes = workOrders
    .filter(order => order.status === 'completed')
    .map(order => {
      const created = new Date(order.createdAt)
      const completed = new Date(order.notes.find(note => 
        note.content.toLowerCase().includes('started') ||
        note.content.toLowerCase().includes('began')
      )?.createdAt || order.createdAt)
      return (completed.getTime() - created.getTime()) / (1000 * 60 * 60) // Convert to hours
    })

  if (responseTimes.length === 0) return '0'
  const average = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  return average.toFixed(1)
}

const calculateCompletionRate = (): string => {
  const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
  if (workOrders.length === 0) return '0'
  
  const completed = workOrders.filter(order => order.status === 'completed').length
  return ((completed / workOrders.length) * 100).toFixed(1)
}

const calculateAverageCost = (): string => {
  const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
  const completedOrders = workOrders.filter(order => 
    order.status === 'completed' && order.actualCost
  )
  
  if (completedOrders.length === 0) return '0'
  const totalCost = completedOrders.reduce((sum, order) => sum + (order.actualCost || 0), 0)
  return (totalCost / completedOrders.length).toFixed(2)
}

const calculateTotalSpending = (): string => {
  const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
  const totalCost = workOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.actualCost || 0), 0)
  
  return totalCost.toFixed(2)
}

export default Analytics