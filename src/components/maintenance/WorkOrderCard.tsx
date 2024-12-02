import { Clock, Calendar, DollarSign, User } from 'lucide-react'
import { WorkOrder } from '../../types/workOrder'

interface WorkOrderCardProps {
  workOrder: WorkOrder
  onClick: () => void
}

const getPriorityClass = (priority: WorkOrder['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/20 text-red-400'
    case 'high':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'medium':
      return 'bg-blue-500/20 text-blue-400'
    case 'low':
      return 'bg-gray-500/20 text-gray-400'
  }
}

const getStatusClass = (status: WorkOrder['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400'
    case 'in-progress':
      return 'bg-blue-500/20 text-blue-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'cancelled':
      return 'bg-red-500/20 text-red-400'
  }
}

const WorkOrderCard = ({ workOrder, onClick }: WorkOrderCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="glass glass-hover p-4 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{workOrder.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{workOrder.description}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(workOrder.priority)}`}>
            {workOrder.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(workOrder.status)}`}>
            {workOrder.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Due: {new Date(workOrder.dueDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Created: {new Date(workOrder.createdAt).toLocaleDateString()}
        </div>
        {workOrder.estimatedCost && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Est. Cost: ${workOrder.estimatedCost}
          </div>
        )}
        {workOrder.assignedTo && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {workOrder.assignedTo}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkOrderCard