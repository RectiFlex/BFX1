import { Personnel, PersonnelFormData } from '../types/personnel'
import { validateRequest, schemas } from '../middleware/validation'
import { ApiError } from '../middleware/error'

export const personnelApi = {
  getAll: async (): Promise<Personnel[]> => {
    const personnel = localStorage.getItem('personnel')
    return personnel ? JSON.parse(personnel) : []
  },

  getById: async (id: string): Promise<Personnel> => {
    const personnel = await personnelApi.getAll()
    const person = personnel.find(p => p.id === id)
    if (!person) {
      throw new ApiError(404, 'Personnel not found')
    }
    return person
  },

  create: async (data: PersonnelFormData): Promise<Personnel> => {
    // Validate request data
    validateRequest(schemas.personnel, data)

    const personnel = await personnelApi.getAll()
    const newPerson: Personnel = {
      id: crypto.randomUUID(),
      ...data,
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      activeWorkOrders: 0,
      completedWorkOrders: 0,
      rating: 0,
      availability: 'available'
    }

    personnel.push(newPerson)
    localStorage.setItem('personnel', JSON.stringify(personnel))
    return newPerson
  },

  update: async (id: string, data: Partial<Personnel>): Promise<Personnel> => {
    const personnel = await personnelApi.getAll()
    const index = personnel.findIndex(p => p.id === id)
    if (index === -1) {
      throw new ApiError(404, 'Personnel not found')
    }

    // Validate partial update data
    validateRequest(schemas.personnel.partial(), data)

    const updatedPerson = {
      ...personnel[index],
      ...data
    }

    personnel[index] = updatedPerson
    localStorage.setItem('personnel', JSON.stringify(personnel))
    return updatedPerson
  },

  updateStatus: async (id: string, status: Personnel['status']): Promise<Personnel> => {
    const personnel = await personnelApi.getAll()
    const index = personnel.findIndex(p => p.id === id)
    if (index === -1) {
      throw new ApiError(404, 'Personnel not found')
    }

    personnel[index].status = status
    localStorage.setItem('personnel', JSON.stringify(personnel))
    return personnel[index]
  },

  delete: async (id: string): Promise<void> => {
    const personnel = await personnelApi.getAll()
    const filteredPersonnel = personnel.filter(p => p.id !== id)
    if (filteredPersonnel.length === personnel.length) {
      throw new ApiError(404, 'Personnel not found')
    }
    localStorage.setItem('personnel', JSON.stringify(filteredPersonnel))
  }
}