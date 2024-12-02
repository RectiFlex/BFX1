import { Star, MailIcon, Phone, Briefcase } from 'lucide-react'
import { Personnel } from '../../types/personnel'

interface PersonnelCardProps {
  person: Personnel
  onClick: () => void
}

const getAvailabilityClass = (availability: Personnel['availability']) => {
  switch (availability) {
    case 'available':
      return 'bg-green-500/20 text-green-400'
    case 'busy':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'unavailable':
      return 'bg-red-500/20 text-red-400'
  }
}

const PersonnelCard = ({ person, onClick }: PersonnelCardProps) => {
  return (
    <div 
      onClick={onClick} 
      className="glass glass-hover p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium">{person.firstName} {person.lastName}</h3>
          <p className="text-sm text-gray-400 mt-1 capitalize">{person.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getAvailabilityClass(person.availability)}`}>
          {person.availability}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <MailIcon className="w-4 h-4" />
          {person.email}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Phone className="w-4 h-4" />
          {person.phone}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Briefcase className="w-4 h-4" />
          {person.specialties.join(', ')}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{person.rating}</span>
            <span className="text-gray-400">
              ({person.completedWorkOrders} jobs)
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Active: </span>
            <span>{person.activeWorkOrders}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonnelCard