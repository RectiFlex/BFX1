import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} glass p-4 m-4 flex flex-col transition-all duration-300`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'}`}>
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && <h1 className="text-xl font-bold">BlockFix</h1>}
      </div>

      <nav className="flex flex-col gap-2 mt-8 flex-grow">
        <NavLink to="/" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <LayoutDashboard className="w-5 h-5" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/properties" className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <Building2 className="w-5 h-5" />
          {!isCollapsed && <span>Properties</span>}
        </NavLink>
        <NavLink to="/maintenance" className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <Wrench className="w-5 h-5" />
          {!isCollapsed && <span>Maintenance</span>}
        </NavLink>
        <NavLink to="/analytics" className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <BarChart3 className="w-5 h-5" />
          {!isCollapsed && <span>Analytics</span>}
        </NavLink>
        <NavLink to="/personnel" className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <Users className="w-5 h-5" />
          {!isCollapsed && <span>Personnel</span>}
        </NavLink>
        <NavLink to="/reports" className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <FileText className="w-5 h-5" />
          {!isCollapsed && <span>Reports</span>}
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      <div className="mt-4 flex flex-col gap-2">
        <button 
          onClick={handleLogout}
          className="nav-item justify-center text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="nav-item justify-center"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar