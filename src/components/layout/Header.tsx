import { Menu, Bell, Search, User } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import alertsData from '@/data/alerts.json'

export function Header() {
  const { toggleSidebar } = useAppStore()
  const unreadCount = alertsData.filter(a => a.status === 'unread').length

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-gray-500">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="搜索..."
              className="bg-transparent border-none outline-none text-sm w-48"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">管理员</p>
              <p className="text-xs text-gray-500">admin@ranhou.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
