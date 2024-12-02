import { WorkOrder, WorkOrderFormData, WorkOrderNote } from '../types/workOrder'
import { validateRequest, schemas } from '../middleware/validation'
import { ApiError } from '../middleware/error'

export const workOrdersApi = {
  getAll: async (): Promise<WorkOrder[]> => {
    const workOrders = localStorage.getItem('workOrders')
    return workOrders ? JSON.parse(workOrders) : []
  },

  getById: async (id: string): Promise<WorkOrder> => {
    const workOrders = await workOrdersApi.getAll()
    const workOrder = workOrders.find(wo => wo.id === id)
    if (!workOrder) {
      throw new ApiError(404, 'Work order not found')
    }
    return workOrder
  },

  create: async (data: WorkOrderFormData): Promise<WorkOrder> => {
    // Validate request data
    validateRequest(schemas.workOrder, data)

    const workOrders = await workOrdersApi.getAll()
    const newWorkOrder: WorkOrder = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: [],
      attachments: []
    }

    workOrders.push(newWorkOrder)
    localStorage.setItem('workOrders', JSON.stringify(workOrders))
    return newWorkOrder
  },

  update: async (id: string, data: Partial<WorkOrder>): Promise<WorkOrder> => {
    const workOrders = await workOrdersApi.getAll()
    const index = workOrders.findIndex(wo => wo.id === id)
    if (index === -1) {
      throw new ApiError(404, 'Work order not found')
    }

    const updatedWorkOrder = {
      ...workOrders[index],
      ...data
    }

    workOrders[index] = updatedWorkOrder
    localStorage.setItem('workOrders', JSON.stringify(workOrders))
    return updatedWorkOrder
  },

  addNote: async (id: string, note: Omit<WorkOrderNote, 'id' | 'createdAt'>): Promise<WorkOrder> => {
    const workOrders = await workOrdersApi.getAll()
    const index = workOrders.findIndex(wo => wo.id === id)
    if (index === -1) {
      throw new ApiError(404, 'Work order not found')
    }

    const newNote: WorkOrderNote = {
      id: crypto.randomUUID(),
      ...note,
      createdAt: new Date().toISOString()
    }

    workOrders[index].notes.unshift(newNote)
    localStorage.setItem('workOrders', JSON.stringify(workOrders))
    return workOrders[index]
  },

  delete: async (id: string): Promise<void> => {
    const workOrders = await workOrdersApi.getAll()
    const filteredWorkOrders = workOrders.filter(wo => wo.id !== id)
    if (filteredWorkOrders.length === workOrders.length) {
      throw new ApiError(404, 'Work order not found')
    }
    localStorage.setItem('workOrders', JSON.stringify(filteredWorkOrders))
  }
}