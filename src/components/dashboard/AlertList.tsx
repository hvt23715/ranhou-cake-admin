import { useState } from 'react'
import { AlertTriangle, Package, Video, TrendingUp, Settings } from 'lucide-react'
import alertsData from '@/data/alerts.json'
import { cn } from '@/lib/utils'

const typeIcons = {
  inventory: Package,
  violation: Video,
  sales: TrendingUp,
  equipment: Settings,
}

const levelColors = {
  error: 'bg-red-50 text-red-600 border-red-200',
  warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  info: 'bg-blue-50 text-blue-600 border-blue-200',
  success: 'bg-green-50 text-green-600 border-green-200',
}


export function AlertList() {
  const [alerts] = useState(alertsData.slice(0, 5))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">最新预警</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          查看全部
        </button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = typeIcons[alert.type as keyof typeof typeIcons] || AlertTriangle
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                levelColors[alert.level as keyof typeof levelColors]
              )}
            >
              <div className="p-2 bg-white bg-opacity-50 rounded-lg">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{alert.title}</span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      alert.status === 'unread'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    )}
                  >
                    {alert.status === 'unread' ? '未读' : '已读'}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-90 line-clamp-2">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                  <span>{alert.store}</span>
                  <span>·</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
