import { useNavigate } from 'react-router-dom'
import { Camera, ArrowRight, Video, AlertTriangle } from 'lucide-react'
import storesData from '@/data/stores.json'

const previewStores = [
  { ...storesData[0], cameraName: '操作间', hasAlert: false },
  { ...storesData[1], cameraName: '收银台', hasAlert: true },
  { ...storesData[3], cameraName: '展示区', hasAlert: false },
]

export function DashboardCameraPreview() {
  const navigate = useNavigate()

  const alertCount = previewStores.filter((s) => s.hasAlert).length

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">实时监控</h3>
        </div>
        <button
          onClick={() => navigate('/camera')}
          className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
        >
          查看监控
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-2 min-h-[140px]">
        {previewStores.map((store) => (
          <div
            key={store.id}
            className="relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => navigate('/camera')}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                <p className="text-[10px] text-gray-500">{store.cameraName}</p>
              </div>
            </div>

            <div className="absolute top-1.5 left-1.5">
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-medium rounded-full">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
            </div>

            {store.hasAlert && (
              <div className="absolute top-1.5 right-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-[10px] text-white font-medium truncate">
                {store.name.replace('燃厚蛋糕 - ', '')}
              </p>
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          {alertCount > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-yellow-600">{alertCount} 个门店有预警</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-500">所有门店运行正常</span>
            </>
          )}
        </div>
        <span className="text-xs text-gray-400">
          共 {storesData.length} 个监控点
        </span>
      </div>
    </div>
  )
}
