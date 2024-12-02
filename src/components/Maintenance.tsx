import { useState, useEffect } from 'react'
import { Plus, Filter, Search } from 'lucide-react'
import CreateWorkOrderModal from './maintenance/CreateWorkOrderModal'
import WorkOrderCard from './maintenance/WorkOrderCard'
import WorkOrderModal from './maintenance/WorkOrderModal'
import { WorkOrder, WorkOrderFormData, WorkOrderNote } from '../types/workOrder'

const MOCK_PROPERTIES = [
  { id: '1', address: '123 Main St' },
  { id: '2', address: '456 Oak Ave' },
  { id: '3', address: '789 Pine Rd' },
]

const Maintenance = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<WorkOrder['status'] | 'all'>('all')

  useEffect(() => {
    const savedWorkOrders = localStorage.getItem('workOrders')
    if (savedWorkOrders) {
      setWorkOrders(JSON.parse(savedWorkOrders))
    }
  }, [])

  const saveWorkOrders = (orders: WorkOrder[]) => {
    localStorage.setItem('workOrders', JSON.stringify(orders))
    setWorkOrders(orders)
  }

  const handleCreateWorkOrder = async (data: WorkOrderFormData) => {
    const newWorkOrder: WorkOrder = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: [],
      attachments: [],
    }
    saveWorkOrders([...workOrders, newWorkOrder])
  }

  const handleStatusChange = (id: string, status: WorkOrder['status']) => {
    const updatedWorkOrders = workOrders.map(wo => 
      wo.id === id ? { ...wo, status } : wo
    )
    saveWorkOrders(updatedWorkOrders)
  }

  const handleAddNote = (id: string, noteData: Omit<WorkOrderNote, 'id' | 'createdAt'>) => {
    const updatedWorkOrders = workOrders.map(wo => {
      if (wo.id === id) {
        const newNote: WorkOrderNote = {
          id: crypto.randomUUID(),
          ...noteData,
          createdAt: new Date().toISOString(),
        }
        return {
          ...wo,
          notes: [newNote, ...wo.notes],
        }
      }
      return wo
    })
    saveWorkOrders(updatedWorkOrders)
  }

  const filteredWorkOrders = workOrders
    .filter(wo => statusFilter === 'all' || wo.status === statusFilter)
    .filter(wo => 
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const groupedWorkOrders = filteredWorkOrders.reduce((acc, wo) => {
    if (!acc[wo.status]) acc[wo.status] = []
    acc[wo.status].push(wo)
    return acc
  }, {} as Record<WorkOrder['status'], WorkOrder[]>)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Work Orders</h1>
        <div className="flex gap-4">
          <div className="glass p-2 flex items-center gap-2 w-64">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search work orders..."
              className="bg-transparent border-none outline-none w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkOrder['status'] | 'all')}
            className="glass glass-hover px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="glass glass-hover px-4 py-2 flex items-center gap-2 bg-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Work Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {(['pending', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
          <div key={status} className="space-y-4">
            <h2 className="text-lg font-semibold capitalize">{status}</h2>
            <div className="space-y-4">
              {(groupedWorkOrders[status] || []).map((workOrder) => (
                <WorkOrderCard
                  key={workOrder.id}
                  workOrder={workOrder}
                  onClick={() => setSelectedWorkOrder(workOrder)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <CreateWorkOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWorkOrder}
        properties={MOCK_PROPERTIES}
      />

      {selectedWorkOrder && (
        <WorkOrderModal
          workOrder={selectedWorkOrder}
          isOpen={true}
          onClose={() => setSelectedWorkOrder(null)}
          onStatusChange={handleStatusChange}
          onAddNote={handleAddNote}
          property={MOCK_PROPERTIES.find(p => p.id === selectedWorkOrder.propertyId)!}
        />
      )}
    </div>
  )
}

export default Maintenance