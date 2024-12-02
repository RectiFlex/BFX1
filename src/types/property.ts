export interface Property {
  id: string
  address: string
  unit?: string
  city: string
  state: string
  zipCode: string
  maintenanceTasks: number
  warranties: number
  lastInspection: string
  status: 'active' | 'inactive'
  contractAddress?: string
  owner: {
    name: string
    email: string
    phone: string
    wallet: string
  }
  maintenanceHistory: MaintenanceRecord[]
}

export interface MaintenanceRecord {
  id: string
  date: string
  type: string
  description: string
  cost: number
  status: 'completed' | 'pending' | 'in-progress'
  contractor: string
}

export interface PropertyFormData {
  address: string
  unit?: string
  city: string
  state: string
  zipCode: string
}