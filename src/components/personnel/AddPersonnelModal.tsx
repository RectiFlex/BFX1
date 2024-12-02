import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Personnel, PersonnelFormData, PersonnelSpecialty } from '../../types/personnel'

interface AddPersonnelModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (personnel: Personnel) => Promise<void>
}

const SPECIALTIES: PersonnelSpecialty[] = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'General Maintenance',
  'Landscaping',
  'Cleaning',
  'Carpentry',
]

const AddPersonnelModal = ({ isOpen, onClose, onAdd }: AddPersonnelModalProps) => {
  const [formData, setFormData] = useState<PersonnelFormData>({
    firstName: '',
    lastName: '',
    role: 'employee',
    email: '',
    phone: '',
    specialties: [],
    rate: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const newPerson: Personnel = {
        id: crypto.randomUUID(),
        ...formData,
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        activeWorkOrders: 0,
        completedWorkOrders: 0,
        rating: 0,
        availability: 'available',
      }
      await onAdd(newPerson)
      onClose()
      setFormData({
        firstName: '',
        lastName: '',
        role: 'employee',
        email: '',
        phone: '',
        specialties: [],
        rate: 0,
      })
    } catch (error) {
      console.error('Error adding personnel:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSpecialty = (specialty: PersonnelSpecialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md glass p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold">
                    Add Personnel
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                        className="w-full glass p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                        className="w-full glass p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Role
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({...prev, role: e.target.value as Personnel['role']}))}
                      className="w-full glass p-2"
                    >
                      <option value="employee">Employee</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      className="w-full glass p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      className="w-full glass p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Specialties
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES.map((specialty) => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            formData.specialties.includes(specialty)
                              ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-400/30'
                              : 'glass glass-hover'
                          }`}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.rate || ''}
                      onChange={(e) => setFormData(prev => ({...prev, rate: parseFloat(e.target.value)}))}
                      className="w-full glass p-2"
                    />
                  </div>

                  {formData.role === 'contractor' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          License Number
                        </label>
                        <input
                          type="text"
                          value={formData.license || ''}
                          onChange={(e) => setFormData(prev => ({...prev, license: e.target.value}))}
                          className="w-full glass p-2"
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Insurance Information</h4>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Provider
                          </label>
                          <input
                            type="text"
                            value={formData.insurance?.provider || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              insurance: { ...prev.insurance, provider: e.target.value } as any
                            }))}
                            className="w-full glass p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Policy Number
                          </label>
                          <input
                            type="text"
                            value={formData.insurance?.policyNumber || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              insurance: { ...prev.insurance, policyNumber: e.target.value } as any
                            }))}
                            className="w-full glass p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            value={formData.insurance?.expirationDate || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              insurance: { ...prev.insurance, expirationDate: e.target.value } as any
                            }))}
                            className="w-full glass p-2"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="glass glass-hover px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="glass glass-hover px-4 py-2 bg-blue-500/20 disabled:opacity-50"
                    >
                      {isLoading ? 'Adding...' : 'Add Personnel'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AddPersonnelModal