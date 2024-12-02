export type PersonnelRole = 'employee' | 'contractor'
export type PersonnelSpecialty = 'HVAC' | 'Plumbing' | 'Electrical' | 'General Maintenance' | 'Landscaping' | 'Cleaning' | 'Carpentry'
export type PersonnelStatus = 'active' | 'inactive' | 'on-leave'

export interface Personnel {
  id: string
  firstName: string
  lastName: string
  role: PersonnelRole
  email: string
  phone: string
  specialties: PersonnelSpecialty[]
  rate: number
  status: PersonnelStatus
  hireDate: string
  activeWorkOrders: number
  completedWorkOrders: number
  rating: number
  availability: 'available' | 'busy' | 'unavailable'
  license?: string
  insurance?: {
    provider: string
    policyNumber: string
    expirationDate: string
  }
}

export interface PersonnelFormData {
  firstName: string
  lastName: string
  role: PersonnelRole
  email: string
  phone: string
  specialties: PersonnelSpecialty[]
  rate: number
  license?: string
  insurance?: {
    provider: string
    policyNumber: string
    expirationDate: string
  }
}