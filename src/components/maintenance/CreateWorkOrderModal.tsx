import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Loader2 } from 'lucide-react'
import { WorkOrderFormData, WorkOrderPriority } from '../../types/workOrder'

interface CreateWorkOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WorkOrderFormData) => Promise<void>
  properties: Array<{ id: string; address: string }>
}

const CATEGORIES = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Structural',
  'Appliance',
  'Landscaping',
  'General',
]

const PRIORITIES: { value: WorkOrderPriority; label: string; class: string }[] = [
  { value: 'low', label: 'Low', class: 'bg-gray-500/20 text-gray-400' },
  { value: 'medium', label: 'Medium', class: 'bg-blue-500/20 text-blue-400' },
  { value: 'high', label: 'High', class: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'urgent', label: 'Urgent', class: 'bg-red-500/20 text-red-400' },
]

const CreateWorkOrderModal = ({ isOpen, onClose, onSubmit, properties }: CreateWorkOrderModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<WorkOrderFormData>({
    propertyId: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    estimatedCost: undefined,
    assignedTo: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onClose()
      setFormData({
        propertyId: '',
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: '',
        estimatedCost: undefined,
        assignedTo: '',
      })
    } catch (error) {
      console.error('Error creating work order:', error)
    } finally {
      setIsLoading(false)
    }
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
              <Dialog.Panel className="w-full max-w-2xl glass p-6 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-semibold">
                    Create Work Order
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Property</label>
                    <select
                      required
                      value={formData.propertyId}
                      onChange={(e) => setFormData(prev => ({...prev, propertyId: e.target.value}))}
                      className="w-full glass p-2"
                    >
                      <option value="">Select a property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                      className="w-full glass p-2"
                      placeholder="Brief description of the issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      className="w-full glass p-2 min-h-[100px]"
                      placeholder="Detailed description of the maintenance required"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                        className="w-full glass p-2"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <div className="flex gap-2">
                        {PRIORITIES.map((priority) => (
                          <button
                            key={priority.value}
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, priority: priority.value}))}
                            className={`px-3 py-1 rounded-full ${priority.class} ${
                              formData.priority === priority.value ? 'ring-2 ring-white/50' : ''
                            }`}
                          >
                            {priority.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Due Date</label>
                      <input
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))}
                        className="w-full glass p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Cost ($)</label>
                      <input
                        type="number"
                        value={formData.estimatedCost || ''}
                        onChange={(e) => setFormData(prev => ({...prev, estimatedCost: parseFloat(e.target.value) || undefined}))}
                        className="w-full glass p-2"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Assign To</label>
                    <input
                      type="text"
                      value={formData.assignedTo || ''}
                      onChange={(e) => setFormData(prev => ({...prev, assignedTo: e.target.value}))}
                      className="w-full glass p-2"
                      placeholder="Contractor or staff member name"
                    />
                  </div>

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
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        'Create Work Order'
                      )}
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

export default CreateWorkOrderModal