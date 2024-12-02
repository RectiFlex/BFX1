import { Wrench } from 'lucide-react'

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass p-8 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Wrench className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Under Maintenance</h1>
        <p className="text-gray-400">
          We're currently performing scheduled maintenance to improve your experience.
          Please check back soon.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Expected completion: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default MaintenanceMode