import { useState, useEffect } from 'react'
import { Plus, Search, Loader2 } from 'lucide-react'
import { ethers } from 'ethers'
import AddPropertyModal from './AddPropertyModal'
import PropertyModal from './PropertyModal'
import { Property, PropertyFormData } from '../types/property'

const PROPERTY_CONTRACT_ABI = [
  "function initialize(string memory _address, string memory _details) public",
  "function getPropertyDetails() public view returns (string memory, string memory)",
]

// Mock data for initial properties
const MOCK_INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    maintenanceTasks: 3,
    warranties: 2,
    lastInspection: '2024-02-01',
    status: 'active',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    owner: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    maintenanceHistory: [
      {
        id: '1',
        date: '2024-02-15',
        type: 'HVAC Maintenance',
        description: 'Annual inspection and filter replacement',
        cost: 250,
        status: 'completed',
        contractor: 'ABC HVAC Services'
      }
    ]
  },
  {
    id: '2',
    address: '456 Oak Avenue',
    unit: '2B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    maintenanceTasks: 1,
    warranties: 4,
    lastInspection: '2024-01-15',
    status: 'active',
    contractAddress: '0x892d35Cc6634C0532925a3b844Bc454e4438f55f',
    owner: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 987-6543',
      wallet: '0x892d35Cc6634C0532925a3b844Bc454e4438f55f'
    },
    maintenanceHistory: [
      {
        id: '2',
        date: '2024-01-20',
        type: 'Plumbing',
        description: 'Fix leaking bathroom faucet',
        cost: 150,
        status: 'completed',
        contractor: 'Quick Plumbing Co'
      }
    ]
  },
  {
    id: '3',
    address: '789 Pine Road',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    maintenanceTasks: 2,
    warranties: 3,
    lastInspection: '2024-02-10',
    status: 'active',
    contractAddress: '0x992d35Cc6634C0532925a3b844Bc454e4438f66g',
    owner: {
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '(555) 456-7890',
      wallet: '0x992d35Cc6634C0532925a3b844Bc454e4438f66g'
    },
    maintenanceHistory: [
      {
        id: '3',
        date: '2024-02-05',
        type: 'Electrical',
        description: 'Update circuit breaker panel',
        cost: 450,
        status: 'completed',
        contractor: 'Elite Electric'
      }
    ]
  }
]

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load properties from localStorage or use mock data if none exists
    const savedProperties = localStorage.getItem('properties')
    if (savedProperties) {
      setProperties(JSON.parse(savedProperties))
    } else {
      // Initialize with mock data if no properties exist
      localStorage.setItem('properties', JSON.stringify(MOCK_INITIAL_PROPERTIES))
      setProperties(MOCK_INITIAL_PROPERTIES)
    }
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature')
      return null
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      return signer
    } catch (error) {
      console.error('Error connecting wallet:', error)
      return null
    }
  }

  const deployPropertyContract = async (propertyData: PropertyFormData) => {
    const signer = await connectWallet()
    if (!signer) return null

    const contractBytecode = "608060405234801561001057600080fd5b50610771806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063486c5f3d1461003b5780638129fc1c14610050575b600080fd5b61004e610049366004610477565b610065565b005b61004e61006336600461052f565b6100f5565b6040518060400160405280838152602001828152506000820151816000019081610090919061059e565b50602082015181600101908161010591906105f0565b505050565b60408051808201909152600080825260208201526040518060400160405280838152602001828152506000820151816000019081610133919061059e565b50602082015181600101908161014891906105f0565b505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261017557600080fd5b813567ffffffffffffffff8082111561019057610190610150565b604051601f8301601f19908116603f011681019082821181831017156101b8576101b8610150565b816040528381528660208588010111156101d157600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080604083850312156102045600a265627a7a723158209f7f891b456ec01502a6347a94104b3fa54dfe54c5c34a04a04749e4d34c8add64736f6c634300081100032"

    try {
      setIsLoading(true)
      const factory = new ethers.ContractFactory(PROPERTY_CONTRACT_ABI, contractBytecode, signer)
      const propertyAddress = `${propertyData.address}${propertyData.unit ? ` Unit ${propertyData.unit}` : ''}`
      const propertyDetails = `${propertyData.city}, ${propertyData.state} ${propertyData.zipCode}`
      
      const contract = await factory.deploy()
      await contract.waitForDeployment()
      
      const contractAddress = await contract.getAddress()
      await contract.initialize(propertyAddress, propertyDetails)
      
      return contractAddress
    } catch (error) {
      console.error('Error deploying contract:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProperty = async (propertyData: PropertyFormData) => {
    const contractAddress = await deployPropertyContract(propertyData)
    if (!contractAddress) {
      alert('Failed to deploy property contract')
      return
    }

    const newProperty: Property = {
      id: crypto.randomUUID(),
      address: propertyData.address,
      unit: propertyData.unit,
      city: propertyData.city,
      state: propertyData.state,
      zipCode: propertyData.zipCode,
      maintenanceTasks: 0,
      warranties: 0,
      lastInspection: new Date().toISOString().split('T')[0],
      status: 'active',
      contractAddress,
      owner: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      },
      maintenanceHistory: []
    }

    const updatedProperties = [...properties, newProperty]
    setProperties(updatedProperties)
    localStorage.setItem('properties', JSON.stringify(updatedProperties))
  }

  const filteredProperties = properties.filter(property => 
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Properties</h1>
        <button 
          className="glass glass-hover px-4 py-2 flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Property
        </button>
      </div>

      <div className="glass p-2 flex items-center gap-2 max-w-md">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties..."
          className="bg-transparent border-none outline-none w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="glass glass-hover p-6 cursor-pointer"
            onClick={() => setSelectedProperty(property)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{property.address}</h3>
                <p className="text-sm text-gray-400">
                  {property.unit ? `Unit ${property.unit}, ` : ''}{property.city}, {property.state}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                {property.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Maintenance Tasks</span>
                <span>{property.maintenanceTasks} Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Warranties</span>
                <span>{property.warranties} Valid</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Inspection</span>
                <span>{property.lastInspection}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Contract</span>
                <span className="truncate ml-2 text-blue-400">
                  {property.contractAddress?.slice(0, 6)}...{property.contractAddress?.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProperty}
      />

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={true}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  )
}

export default Properties