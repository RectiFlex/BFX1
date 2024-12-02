import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const MaintenanceTable = () => {
  const maintenanceData = [
    {
      id: 1,
      property: "123 Main St",
      issue: "HVAC Repair",
      status: "In Progress",
      date: "2024-02-15",
    },
    {
      id: 2,
      property: "456 Oak Ave",
      issue: "Plumbing",
      status: "Completed",
      date: "2024-02-14",
    },
    {
      id: 3,
      property: "789 Pine Rd",
      issue: "Electrical",
      status: "Pending",
      date: "2024-02-13",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'Pending':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="pb-4">Property</th>
            <th className="pb-4">Issue</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceData.map((item) => (
            <tr key={item.id} className="border-t border-white/10">
              <td className="py-4">{item.property}</td>
              <td className="py-4">{item.issue}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
              </td>
              <td className="py-4">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MaintenanceTable