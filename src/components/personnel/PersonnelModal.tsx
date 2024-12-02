import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  DollarSign, 
  ShieldCheck, 
  ClipboardCheck
} from 'lucide-react'
import { Personnel } from '../../types/personnel'

interface PersonnelModalProps {
  person: Personnel
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: Personnel['status']) => void
}

const PersonnelModal = ({ person, isOpen, onClose, onStatusChange }: PersonnelModalProps) => {
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
                  <div>
                    <Dialog.Title className="text-xl font-semibold">
                      {person.firstName} {person.lastName}
                    </Dialog.Title>
                    <p className="text-gray-400 capitalize">{person.role}</p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="glass p-4">
                      <h3 className="font-medium mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{person.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span>{person.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-4">
                      <h3 className="font-medium mb-4">Work Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Hire Date</p>
                            <p>{new Date(person.hireDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Rating</p>
                            <p>{person.rating} ({person.completedWorkOrders} completed jobs)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Hourly Rate</p>
                            <p>${person.rate}/hour</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="glass p-4">
                      <h3 className="font-medium mb-4">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {person.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {person.role === 'contractor' && person.insurance && (
                      <div className="glass p-4">
                        <h3 className="font-medium mb-4">Contractor Details</h3>
                        <div className="space-y-3">
                          {person.license && (
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-400">License</p>
                                <p>{person.license}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <ClipboardCheck className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Insurance</p>
                              <p>{person.insurance.provider}</p>
                              <p className="text-sm text-gray-400">
                                Policy: {person.insurance.policyNumber}
                              </p>
                              <p className="text-sm text-gray-400">
                                Expires: {new Date(person.insurance.expirationDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="glass p-4">
                      <h3 className="font-medium mb-4">Status</h3>
                      <div className="flex gap-2">
                        {(['active', 'inactive', 'on-leave'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => onStatusChange(person.id, status)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              person.status === status ? 'ring-2 ring-white/50' : ''
                            } ${
                              status === 'active' ? 'bg-green-500/20 text-green-400' :
                              status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PersonnelModal