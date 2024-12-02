import { ApiError } from './error'
import { z } from 'zod'

export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, error.errors[0].message)
    }
    throw error
  }
}

// Common validation schemas
export const schemas = {
  property: z.object({
    address: z.string().min(1, 'Address is required'),
    unit: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
  }),

  workOrder: z.object({
    propertyId: z.string().min(1, 'Property ID is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    dueDate: z.string().min(1, 'Due date is required'),
    category: z.string().min(1, 'Category is required'),
    estimatedCost: z.number().optional(),
    assignedTo: z.string().optional(),
  }),

  personnel: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.enum(['employee', 'contractor']),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
    rate: z.number().min(0, 'Rate must be non-negative'),
  }),
}