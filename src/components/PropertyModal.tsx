import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, ExternalLink, Building2, User, Phone, Mail, Wallet } from 'lucide-react'
import { Property } from '../types/property'

interface PropertyModalProps {
  property: Property
  isOpen: boolean
  onClose: () => void
}

const PropertyModal = ({ property, isOpen, onClose }: PropertyModalProps) => {
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
              <Dialog.Panel className="w-full max-w-3xl glass p-6 rounded-xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 glass">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-semibold">
                        {property.address}
                        {property.unit && ` Unit ${property.unit}`}
                      </Dialog.Title>
                      <p className="text-gray-400">
                        {property.city}, {property.state} {property.zipCode}
                      </p>
                    </div>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="glass p-4">
                      <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <span>{property.owner.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span>{property.owner.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span>{property.owner.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-gray-400" />
                          <span className="truncate">{property.owner.wallet}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-4">
                      <h3 className="text-lg font-semibold mb-4">Smart Contract</h3>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-white/5 p-2 rounded flex-1 truncate">
                          {property.contractAddress}
                        </code>
                        <a
                          href={`https://etherscan.io/address/${property.contractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 glass glass-hover"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-4">
                    <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {property.maintenanceHistory.map((record) => (
                        <div key={record.id} className="glass p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{record.type}</h4>
                              <p className="text-sm text-gray-400">{record.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              record.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              record.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-gray-400">
                            <span>{record.date}</span>
                            <span>${record.cost.toFixed(2)}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-400">
                            Contractor: {record.contractor}
                          </div>
                        </div>
                      ))}
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

export default PropertyModal