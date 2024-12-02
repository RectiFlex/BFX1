import { useState, useEffect } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Personnel } from '../types/personnel'
import PersonnelCard from './personnel/PersonnelCard'
import AddPersonnelModal from './personnel/AddPersonnelModal'
import PersonnelModal from './personnel/PersonnelModal'

const MOCK_INITIAL_PERSONNEL: Personnel[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    role: 'employee',
    email: 'john.smith@company.com',
    phone: '(555) 123-4567',
    specialties: ['HVAC', 'General Maintenance'],
    rate: 45,
    status: 'active',
    hireDate: '2023-01-15',
    activeWorkOrders: 3,
    completedWorkOrders: 145,
    rating: 4.8,
    availability: 'busy',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'contractor',
    email: 'sarah@contractingco.com',
    phone: '(555) 987-6543',
    specialties: ['Plumbing', 'Electrical'],
    rate: 65,
    status: 'active',
    hireDate: '2023-03-20',
    activeWorkOrders: 1,
    completedWorkOrders: 89,
    rating: 4.9,
    availability: 'available',
    license: 'PL-123456',
    insurance: {
      provider: 'SafeCo Insurance',
      policyNumber: 'INS-789012',
      expirationDate: '2024-12-31',
    },
  }
]

const PersonnelPage = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | Personnel['role']>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null)

  useEffect(() => {
    const savedPersonnel = localStorage.getItem('personnel')
    if (savedPersonnel) {
      setPersonnel(JSON.parse(savedPersonnel))
    } else {
      localStorage.setItem('personnel', JSON.stringify(MOCK_INITIAL_PERSONNEL))
      setPersonnel(MOCK_INITIAL_PERSONNEL)
    }
  }, [])

  const handleAddPerson = async (data: Personnel) => {
    const newPersonnel = [...personnel, data]
    localStorage.setItem('personnel', JSON.stringify(newPersonnel))
    setPersonnel(newPersonnel)
  }

  const handleStatusChange = (id: string, status: Personnel['status']) => {
    const updatedPersonnel = personnel.map(person =>
      person.id === id ? { ...person, status } : person
    )
    localStorage.setItem('personnel', JSON.stringify(updatedPersonnel))
    setPersonnel(updatedPersonnel)
  }

  const filteredPersonnel = personnel
    .filter(person =>
      roleFilter === 'all' || person.role === roleFilter
    )
    .filter(person =>
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personnel Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="glass glass-hover px-4 py-2 flex items-center gap-2 bg-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Personnel
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="glass p-2 flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personnel..."
            className="bg-transparent border-none outline-none w-full"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | Personnel['role'])}
          className="glass glass-hover px-4 py-2"
        >
          <option value="all">All Roles</option>
          <option value="employee">Employees</option>
          <option value="contractor">Contractors</option>
        </select>

        <button className="glass glass-hover p-2">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonnel.map((person) => (
          <PersonnelCard
            key={person.id}
            person={person}
            onClick={() => setSelectedPerson(person)}
          />
        ))}
      </div>

      <AddPersonnelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPerson}
      />

      {selectedPerson && (
        <PersonnelModal
          person={selectedPerson}
          isOpen={true}
          onClose={() => setSelectedPerson(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

export default PersonnelPage