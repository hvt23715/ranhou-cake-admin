import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  MapPin,
  Video,
  Settings,
  Cake,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '首页仪表盘' },
  { path: '/ai', icon: MessageSquare, label: 'AI助手' },
  { path: '/map', icon: MapPin, label: '门店地图' },
  { path: '/camera', icon: Video, label: '摄像头监控' },
]

const bottomMenuItems = [
  { path: '/settings', icon: Settings, label: '系统设置' },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  const handleNavLinkClick = () => {
    // On mobile, close sidebar when a link is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300',
        sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20 w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cake className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                'font-bold text-lg text-gray-900 whitespace-nowrap transition-opacity duration-300',
                sidebarOpen ? 'opacity-100' : 'opacity-0'
              )}
            >
              燃厚蛋糕
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1 text-gray-400 hover:text-gray-600"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={cn(
                      'whitespace-nowrap transition-opacity duration-300',
                      sidebarOpen ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={cn(
                      'whitespace-nowrap transition-opacity duration-300',
                      sidebarOpen ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
