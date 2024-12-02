import { useState } from 'react'
import { FileText, Download, Calendar, Filter, Loader2 } from 'lucide-react'
import { WorkOrder } from '../types/workOrder'
import { Property } from '../types/property'
import { Personnel } from '../types/personnel'

type ReportType = 'maintenance' | 'property' | 'personnel' | 'financial'
type DateRange = '7d' | '30d' | '90d' | '1y' | 'all'

interface ReportData {
  maintenance: WorkOrder[]
  property: Array<Property & { workOrders: WorkOrder[] }>
  personnel: Array<Personnel & { 
    workOrders: WorkOrder[]
    completionRate: number
    averageResponse: number 
  }>
  financial: {
    totalEstimated: number
    totalActual: number
    variance: number
    byCategory: Record<string, {
      estimated: number
      actual: number
      count: number
    }>
    monthlySpending: Array<{
      month: string
      amount: number
    }>
  }
}

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('maintenance')
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const calculateDateRange = () => {
    const now = new Date()
    const rangeStart = new Date()
    switch (dateRange) {
      case '7d':
        rangeStart.setDate(now.getDate() - 7)
        break
      case '30d':
        rangeStart.setDate(now.getDate() - 30)
        break
      case '90d':
        rangeStart.setDate(now.getDate() - 90)
        break
      case '1y':
        rangeStart.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        rangeStart.setFullYear(2000)
        break
    }
    return rangeStart
  }

  const generateMaintenanceReport = (workOrders: WorkOrder[], rangeStart: Date) => {
    return workOrders.filter(wo => new Date(wo.createdAt) >= rangeStart)
  }

  const generatePropertyReport = (
    properties: Property[], 
    workOrders: WorkOrder[], 
    rangeStart: Date
  ) => {
    return properties.map(property => ({
      ...property,
      workOrders: workOrders.filter(wo => 
        wo.propertyId === property.id && 
        new Date(wo.createdAt) >= rangeStart
      )
    }))
  }

  const generatePersonnelReport = (
    personnel: Personnel[],
    workOrders: WorkOrder[],
    rangeStart: Date
  ) => {
    return personnel.map(person => {
      const personWorkOrders = workOrders.filter(wo => 
        wo.assignedTo === `${person.firstName} ${person.lastName}` &&
        new Date(wo.createdAt) >= rangeStart
      )

      const completedOrders = personWorkOrders.filter(wo => wo.status === 'completed')
      const completionRate = personWorkOrders.length > 0
        ? (completedOrders.length / personWorkOrders.length) * 100
        : 0

      const responseTimes = completedOrders.map(wo => {
        const created = new Date(wo.createdAt)
        const firstNote = wo.notes.find(note => 
          note.content.toLowerCase().includes('started') ||
          note.content.toLowerCase().includes('began')
        )
        const started = firstNote ? new Date(firstNote.createdAt) : created
        return (started.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
      })

      const averageResponse = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0

      return {
        ...person,
        workOrders: personWorkOrders,
        completionRate,
        averageResponse
      }
    })
  }

  const generateFinancialReport = (workOrders: WorkOrder[], rangeStart: Date) => {
    const filteredOrders = workOrders.filter(wo => 
      new Date(wo.createdAt) >= rangeStart &&
      wo.status === 'completed'
    )

    const totalEstimated = filteredOrders.reduce((sum, wo) => sum + (wo.estimatedCost || 0), 0)
    const totalActual = filteredOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0)

    const byCategory = filteredOrders.reduce((acc, wo) => {
      if (!acc[wo.category]) {
        acc[wo.category] = { estimated: 0, actual: 0, count: 0 }
      }
      acc[wo.category].estimated += wo.estimatedCost || 0
      acc[wo.category].actual += wo.actualCost || 0
      acc[wo.category].count += 1
      return acc
    }, {} as Record<string, { estimated: number; actual: number; count: number }>)

    const monthlySpending = filteredOrders.reduce((acc, wo) => {
      const date = new Date(wo.createdAt)
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
      const existingMonth = acc.find(m => m.month === monthKey)
      
      if (existingMonth) {
        existingMonth.amount += wo.actualCost || 0
      } else {
        acc.push({ month: monthKey, amount: wo.actualCost || 0 })
      }
      return acc
    }, [] as Array<{ month: string; amount: number }>)
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ')
      const [monthB, yearB] = b.month.split(' ')
      return new Date(`${monthA} 20${yearA}`).getTime() - new Date(`${monthB} 20${yearB}`).getTime()
    })

    return {
      totalEstimated,
      totalActual,
      variance: totalActual - totalEstimated,
      byCategory,
      monthlySpending
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const workOrders: WorkOrder[] = JSON.parse(localStorage.getItem('workOrders') || '[]')
      const properties: Property[] = JSON.parse(localStorage.getItem('properties') || '[]')
      const personnel: Personnel[] = JSON.parse(localStorage.getItem('personnel') || '[]')

      const rangeStart = calculateDateRange()
      
      const data: ReportData = {
        maintenance: generateMaintenanceReport(workOrders, rangeStart),
        property: generatePropertyReport(properties, workOrders, rangeStart),
        personnel: generatePersonnelReport(personnel, workOrders, rangeStart),
        financial: generateFinancialReport(workOrders, rangeStart)
      }

      setReportData(data)

      // Generate CSV based on report type
      let csv = ''
      switch (selectedReport) {
        case 'maintenance':
          csv = 'ID,Title,Status,Priority,Category,Created,Due Date,Estimated Cost,Actual Cost\n'
          csv += data.maintenance.map(wo => 
            `"${wo.id}","${wo.title}","${wo.status}","${wo.priority}","${wo.category}","${wo.createdAt}","${wo.dueDate}","${wo.estimatedCost || 0}","${wo.actualCost || 0}"`
          ).join('\n')
          break

        case 'property':
          csv = 'Property,Address,City,State,Active Tasks,Total Tasks,Last Inspection,Total Cost\n'
          csv += data.property.map(prop => {
            const totalCost = prop.workOrders.reduce((sum, wo) => sum + (wo.actualCost || 0), 0)
            return `"${prop.id}","${prop.address}","${prop.city}","${prop.state}","${prop.maintenanceTasks}","${prop.workOrders.length}","${prop.lastInspection}","${totalCost}"`
          }).join('\n')
          break

        case 'personnel':
          csv = 'Name,Role,Completion Rate,Average Response (hrs),Active Tasks,Completed Tasks,Rating\n'
          csv += data.personnel.map(person => 
            `"${person.firstName} ${person.lastName}","${person.role}","${person.completionRate.toFixed(1)}%","${person.averageResponse.toFixed(1)}","${person.activeWorkOrders}","${person.completedWorkOrders}","${person.rating}"`
          ).join('\n')
          break

        case 'financial':
          const { financial } = data
          csv = 'Category,Estimated Cost,Actual Cost,Variance,Number of Orders\n'
          csv += Object.entries(financial.byCategory).map(([category, data]) =>
            `"${category}","${data.estimated}","${data.actual}","${data.actual - data.estimated}","${data.count}"`
          ).join('\n')
          csv += '\n\nMonthly Summary\nMonth,Amount\n'
          csv += financial.monthlySpending.map(month =>
            `"${month.month}","${month.amount}"`
          ).join('\n')
          break
      }

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedReport}-report-${dateRange}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button
          onClick={generateReport}
          disabled={isGenerating}
          className="glass glass-hover px-4 py-2 flex items-center gap-2 bg-blue-500/20"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Report
            </>
          )}
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="glass p-2 flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value as ReportType)}
            className="bg-transparent border-none outline-none"
          >
            <option value="maintenance">Maintenance Report</option>
            <option value="property">Property Report</option>
            <option value="personnel">Personnel Report</option>
            <option value="financial">Financial Report</option>
          </select>
        </div>

        <div className="glass p-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="bg-transparent border-none outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Report Preview</h2>
          </div>
          
          {reportData && (
            <div className="space-y-4">
              {selectedReport === 'maintenance' && (
                <>
                  <p className="text-gray-400">Total Work Orders: {reportData.maintenance.length}</p>
                  <div className="space-y-2">
                    <p>Status Distribution:</p>
                    {Object.entries(
                      reportData.maintenance.reduce((acc, wo) => {
                        acc[wo.status] = (acc[wo.status] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([status, count]) => (
                      <div key={status} className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{status}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selectedReport === 'property' && (
                <>
                  <p className="text-gray-400">Total Properties: {reportData.property.length}</p>
                  <div className="space-y-2">
                    <p>Maintenance Summary:</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Tasks</span>
                        <span>{reportData.property.reduce((sum, p) => sum + p.maintenanceTasks, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Properties with Tasks</span>
                        <span>{reportData.property.filter(p => p.maintenanceTasks > 0).length}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedReport === 'personnel' && (
                <>
                  <p className="text-gray-400">Total Personnel: {reportData.personnel.length}</p>
                  <div className="space-y-2">
                    <p>Performance Summary:</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Completion Rate</span>
                        <span>
                          {(reportData.personnel.reduce((sum, p) => sum + p.completionRate, 0) / 
                            reportData.personnel.length).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Response Time</span>
                        <span>
                          {(reportData.personnel.reduce((sum, p) => sum + p.averageResponse, 0) / 
                            reportData.personnel.length).toFixed(1)} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedReport === 'financial' && (
                <>
                  <div className="space-y-2">
                    <p>Financial Summary:</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Estimated</span>
                        <span>${reportData.financial.totalEstimated.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Actual</span>
                        <span>${reportData.financial.totalActual.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-400">Variance</span>
                        <span className={reportData.financial.variance > 0 ? 'text-red-400' : 'text-green-400'}>
                          ${Math.abs(reportData.financial.variance).toFixed(2)}
                          {reportData.financial.variance > 0 ? ' over' : ' under'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="glass p-6">
          <h2 className="text-lg font-semibold mb-4">Report Details</h2>
          <div className="space-y-4 text-sm text-gray-400">
            {selectedReport === 'maintenance' && (
              <>
                <p>This report includes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Work order status distribution</li>
                  <li>Priority levels and response times</li>
                  <li>Task completion rates</li>
                  <li>Cost analysis per work order</li>
                </ul>
              </>
            )}
            {selectedReport === 'property' && (
              <>
                <p>This report includes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Property maintenance history</li>
                  <li>Active maintenance tasks</li>
                  <li>Inspection status</li>
                  <li>Cost per property analysis</li>
                </ul>
              </>
            )}
            {selectedReport === 'personnel' && (
              <>
                <p>This report includes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Individual performance metrics</li>
                  <li>Task completion rates</li>
                  <li>Response time analysis</li>
                  <li>Workload distribution</li>
                </ul>
              </>
            )}
            {selectedReport === 'financial' && (
              <>
                <p>This report includes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Cost analysis by category</li>
                  <li>Budget variance analysis</li>
                  <li>Monthly spending trends</li>
                  <li>Cost per maintenance type</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports