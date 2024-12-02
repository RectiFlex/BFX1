import { useEffect, useState } from 'react'
import { Building2, Wrench, Shield, AlertCircle } from 'lucide-react'
import StatCard from './StatCard'
import MaintenanceTable from './MaintenanceTable'
import PropertyTrendChart from './PropertyTrendChart'
import MaintenanceDistributionChart from './MaintenanceDistributionChart'
import { Property } from '../types/property'
import { WorkOrder } from '../types/workOrder'
import { Personnel } from '../types/personnel'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    properties: 0,
    activeMaintenanceCount: 0,
    validWarranties: 0,
    complianceIssues: 0,
    propertyChange: 0,
    maintenanceChange: 0,
    warrantyChange: 0,
    complianceChange: 0
  })

  useEffect(() => {
    const calculateDashboardStats = () => {
      const properties: Property[] = JSON.parse(localStorage.getItem('properties') || '[]')
      const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
      const personnel: Personnel[] = JSON.parse(localStorage.getItem('personnel') || '[]')

      // Calculate active maintenance tasks
      const activeMaintenanceCount = workOrders.filter(
        wo => wo.status === 'pending' || wo.status === 'in-progress'
      ).length

      // Calculate valid warranties (example logic - adjust as needed)
      const validWarranties = properties.reduce((sum, prop) => sum + prop.warranties, 0)

      // Calculate compliance issues (example - properties without recent inspections)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      const complianceIssues = properties.filter(
        prop => new Date(prop.lastInspection) < threeMonthsAgo
      ).length

      // Calculate changes (simplified - you might want to compare with previous period)
      const propertyChange = properties.length > 0 ? +3 : 0 // Example change
      const maintenanceChange = activeMaintenanceCount > 0 ? +12 : 0
      const warrantyChange = validWarranties > 0 ? -2 : 0
      const complianceChange = complianceIssues > 0 ? +1 : 0

      setDashboardData({
        properties: properties.length,
        activeMaintenanceCount,
        validWarranties,
        complianceIssues,
        propertyChange,
        maintenanceChange,
        warrantyChange,
        complianceChange
      })
    }

    calculateDashboardStats()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Welcome, {currentUser?.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Building2 />}
          title="Total Properties"
          value={dashboardData.properties.toString()}
          change={dashboardData.propertyChange.toString()}
        />
        <StatCard 
          icon={<Wrench />}
          title="Active Maintenance"
          value={dashboardData.activeMaintenanceCount.toString()}
          change={dashboardData.maintenanceChange.toString()}
        />
        <StatCard 
          icon={<Shield />}
          title="Valid Warranties"
          value={dashboardData.validWarranties.toString()}
          change={dashboardData.warrantyChange.toString()}
        />
        <StatCard 
          icon={<AlertCircle />}
          title="Compliance Issues"
          value={dashboardData.complianceIssues.toString()}
          change={dashboardData.complianceChange.toString()}
          negative
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Maintenance</h2>
          <MaintenanceTable />
        </div>
        
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Warranty Status</h2>
          <div className="flex flex-col gap-4">
            {dashboardData.validWarranties > 0 ? (
              <>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="font-medium">HVAC System</h3>
                    <p className="text-sm text-gray-400">Property ID: #1234</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                    Valid
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="font-medium">Roof Installation</h3>
                    <p className="text-sm text-gray-400">Property ID: #1235</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                    Expiring Soon
                  </span>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No warranty data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Property Occupancy Trends</h2>
          <PropertyTrendChart />
        </div>
        
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance Distribution</h2>
          <MaintenanceDistributionChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard