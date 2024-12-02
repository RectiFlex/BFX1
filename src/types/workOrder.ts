export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent'
export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

export interface WorkOrder {
  id: string
  propertyId: string
  title: string
  description: string
  priority: WorkOrderPriority
  status: WorkOrderStatus
  createdAt: string
  dueDate: string
  assignedTo?: string
  estimatedCost?: number
  actualCost?: number
  category: string
  notes: WorkOrderNote[]
  attachments: WorkOrderAttachment[]
}

export interface WorkOrderNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
}

export interface WorkOrderAttachment {
  id: string
  name: string
  url: string
  type: string
  uploadedAt: string
}

export interface WorkOrderFormData {
  propertyId: string
  title: string
  description: string
  priority: WorkOrderPriority
  dueDate: string
  assignedTo?: string
  estimatedCost?: number
  category: string
}