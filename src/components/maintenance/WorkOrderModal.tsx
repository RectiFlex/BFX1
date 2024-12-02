import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MessageSquare, Paperclip, Clock, Calendar, DollarSign, User, Building2 } from 'lucide-react'
import { WorkOrder, WorkOrderNote } from '../../types/workOrder'

interface WorkOrderModalProps {
  workOrder: WorkOrder
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: WorkOrder['status']) => void
  onAddNote: (id: string, note: Omit<WorkOrderNote, 'id' | 'createdAt'>) => void
  property: { id: string; address: string }
}

const WorkOrderModal = ({ 
  workOrder, 
  isOpen, 
  onClose, 
  onStatusChange,
  onAddNote,
  property
}: WorkOrderModalProps) => {
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    if (!newNote.trim()) return
    onAddNote(workOrder.id, {
      content: newNote,
      createdBy: 'Current User' // In a real app, this would come from auth context
    })
    setNewNote('')
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
                <div className="flex justify-between items-start">
                  <Dialog.Title className="text-xl font-semibold">
                    Work Order Details
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-medium">{workOrder.title}</h2>
                    <p className="text-gray-400 mt-2">{workOrder.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Property</p>
                        <p>{property.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Due Date</p>
                        <p>{new Date(workOrder.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Created</p>
                        <p>{new Date(workOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {workOrder.estimatedCost && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Estimated Cost</p>
                          <p>${workOrder.estimatedCost}</p>
                        </div>
                      </div>
                    )}
                    {workOrder.assignedTo && (
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Assigned To</p>
                          <p>{workOrder.assignedTo}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Status</h3>
                    <div className="flex gap-2">
                      {(['pending', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => onStatusChange(workOrder.id, status)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            workOrder.status === status ? 'ring-2 ring-white/50' : ''
                          } ${
                            status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                            status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Notes
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 glass p-2"
                        />
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="glass glass-hover px-4 py-2 bg-blue-500/20 disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-3 max-h-[200px] overflow-y-auto">
                        {workOrder.notes.map((note) => (
                          <div key={note.id} className="glass p-3">
                            <p>{note.content}</p>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                              <span>{note.createdBy}</span>
                              <span>{new Date(note.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {workOrder.attachments.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Paperclip className="w-5 h-5" />
                        Attachments
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {workOrder.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass glass-hover p-3 flex items-center gap-3"
                          >
                            <Paperclip className="w-4 h-4" />
                            <div>
                              <p className="text-sm">{attachment.name}</p>
                              <p className="text-xs text-gray-400">{attachment.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default WorkOrderModal