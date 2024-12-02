import { Property, PropertyFormData } from '../types/property'
import { validateRequest, schemas } from '../middleware/validation'
import { ApiError } from '../middleware/error'

export const propertiesApi = {
  getAll: async (): Promise<Property[]> => {
    const properties = localStorage.getItem('properties')
    return properties ? JSON.parse(properties) : []
  },

  getById: async (id: string): Promise<Property> => {
    const properties = await propertiesApi.getAll()
    const property = properties.find(p => p.id === id)
    if (!property) {
      throw new ApiError(404, 'Property not found')
    }
    return property
  },

  create: async (data: PropertyFormData): Promise<Property> => {
    // Validate request data
    validateRequest(schemas.property, data)

    const properties = await propertiesApi.getAll()
    const newProperty: Property = {
      id: crypto.randomUUID(),
      ...data,
      maintenanceTasks: 0,
      warranties: 0,
      lastInspection: new Date().toISOString().split('T')[0],
      status: 'active',
      owner: {
        name: 'Default Owner',
        email: 'owner@example.com',
        phone: '(555) 000-0000',
        wallet: '0x0000000000000000000000000000000000000000'
      },
      maintenanceHistory: []
    }

    properties.push(newProperty)
    localStorage.setItem('properties', JSON.stringify(properties))
    return newProperty
  },

  update: async (id: string, data: Partial<PropertyFormData>): Promise<Property> => {
    const properties = await propertiesApi.getAll()
    const index = properties.findIndex(p => p.id === id)
    if (index === -1) {
      throw new ApiError(404, 'Property not found')
    }

    // Validate partial update data
    validateRequest(schemas.property.partial(), data)

    const updatedProperty = {
      ...properties[index],
      ...data
    }

    properties[index] = updatedProperty
    localStorage.setItem('properties', JSON.stringify(properties))
    return updatedProperty
  },

  delete: async (id: string): Promise<void> => {
    const properties = await propertiesApi.getAll()
    const filteredProperties = properties.filter(p => p.id !== id)
    if (filteredProperties.length === properties.length) {
      throw new ApiError(404, 'Property not found')
    }
    localStorage.setItem('properties', JSON.stringify(filteredProperties))
  }
}