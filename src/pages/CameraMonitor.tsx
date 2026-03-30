import { useState } from 'react'
import { Video, AlertTriangle, CheckCircle, Clock, MapPin, ChevronDown } from 'lucide-react'
import storesData from '@/data/stores.json'
import { cn } from '@/lib/utils'

interface Violation {
  id: number
  type: string
  description: string
  time: string
  severity: 'high' | 'medium' | 'low'
  status: 'unhandled' | 'handled'
}

const mockViolations: Violation[] = [
  {
    id: 1,
    type: '着装违规',
    description: '员工未佩戴工作帽',
    time: '09:45',
    severity: 'medium',
    status: 'unhandled',
  },
  {
    id: 2,
    type: '卫生违规',
    description: '操作间地面有水渍',
    time: '10:12',
    severity: 'low',
    status: 'handled',
  },
  {
    id: 3,
    type: '操作违规',
    description: '未按规范洗手消毒',
    time: '11:30',
    severity: 'high',
    status: 'unhandled',
  },
  {
    id: 4,
    type: '着装违规',
    description: '围裙佩戴不规范',
    time: '13:20',
    severity: 'low',
    status: 'handled',
  },
  {
    id: 5,
    type: '卫生违规',
    description: '操作台物品摆放杂乱',
    time: '14:45',
    severity: 'medium',
    status: 'unhandled',
  },
]

const severityConfig = {
  high: { label: '严重', color: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: '一般', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: '轻微', color: 'bg-blue-100 text-blue-700 border-blue-200' },
}

export default function CameraMonitor() {
  const [selectedStore, setSelectedStore] = useState(storesData[0])
  const [violations] = useState(mockViolations)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const unhandledCount = violations.filter((v) => v.status === 'unhandled').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">摄像头监控</h1>
          <p className="text-gray-500 mt-1">实时查看门店监控与违规检测</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{selectedStore.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
                {storesData.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store)
                      setIsDropdownOpen(false)
                    }}
                    className={cn(
                      'w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0',
                      selectedStore.id === store.id && 'bg-primary-50 text-primary-600'
                    )}
                  >
                    {store.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-0 overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">监控视频区域</p>
                  <p className="text-sm text-gray-600 mt-2">{selectedStore.name} - 操作间</p>
                </div>
              </div>

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
                <span className="px-3 py-1.5 bg-black bg-opacity-50 text-white text-xs rounded-full">
                  {new Date().toLocaleTimeString('zh-CN')}
                </span>
              </div>

              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 bg-black bg-opacity-50 text-white text-xs rounded-lg">
                  摄像头 01
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-0 overflow-hidden">
              <div className="aspect-video bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">收银台</p>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="aspect-video bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">展示区</p>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">违规检测统计</h3>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                {unhandledCount} 条未处理
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {violations.filter((v) => v.severity === 'high').length}
                </p>
                <p className="text-xs text-red-600 mt-1">严重</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {violations.filter((v) => v.severity === 'medium').length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">一般</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {violations.filter((v) => v.severity === 'low').length}
                </p>
                <p className="text-xs text-blue-600 mt-1">轻微</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">违规记录</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {violations.map((violation) => (
                <div
                  key={violation.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    violation.status === 'unhandled'
                      ? 'bg-white border-gray-200'
                      : 'bg-gray-50 border-gray-100'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {violation.status === 'unhandled' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {violation.type}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {violation.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full border',
                              severityConfig[violation.severity].color
                            )}
                          >
                            {severityConfig[violation.severity].label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {violation.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {violation.status === 'unhandled' && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 px-3 py-1.5 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600">
                        标记已处理
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50">
                        查看详情
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="font-semibold mb-2">AI 智能检测</h3>
            <p className="text-sm text-primary-100">
              系统正在实时监控各门店操作规范，自动识别违规行为并推送预警。
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-sm">检测运行中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
