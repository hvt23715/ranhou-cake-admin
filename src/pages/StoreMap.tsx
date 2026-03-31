import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone, Clock, User, X, Navigation, TrendingUp, Users } from 'lucide-react'
import storesData from '@/data/stores.json'
import { formatCurrency } from '@/lib/utils'

declare global {
  interface Window {
    AMap: any
  }
}

interface Store {
  id: number
  name: string
  address: string
  longitude: number
  latitude: number
  todaySales: number
  todayCustomers: number
  manager: string
  phone: string
  status: string
  openTime: string
}

type HeatmapType = 'sales' | 'customers'

export default function StoreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const heatmapRef = useRef<any>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('sales')
  const [heatmapVisible, setHeatmapVisible] = useState(true)

  useEffect(() => {
    const initMap = async () => {
      if (!window.AMap || !mapContainerRef.current) {
        setMapError(true)
        return
      }

      try {
        // 先确保插件加载完成
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Plugin loading timeout')), 5000)
          window.AMap.plugin(['AMap.HeatMap'], () => {
            clearTimeout(timeout)
            resolve()
          })
        })

        const map = new window.AMap.Map(mapContainerRef.current, {
          zoom: 11,
          center: [125.3238, 43.8965],
          viewMode: '2D',
        })
        mapRef.current = map

        // 使用已保存的经纬度数据直接添加标记
        storesData.forEach((store) => {
          const marker = new window.AMap.Marker({
            position: [store.longitude, store.latitude],
            title: store.name,
            label: {
              content: store.name.replace('燃厚蛋糕 - ', ''),
              direction: 'bottom',
            },
          })

          marker.on('click', () => setSelectedStore(store as Store))
          marker.setMap(map)
        })

        // 初始化热力图
        const heatmap = new window.AMap.HeatMap(map, {
          radius: 35,
          opacity: [0, 0.8],
          zIndex: 100,
        })
        heatmapRef.current = heatmap
        
        const heatmapData = storesData.map((store) => ({
          lng: store.longitude,
          lat: store.latitude,
          count: heatmapType === 'sales' ? store.todaySales : store.todayCustomers,
        }))

        heatmap.setDataSet({
          data: heatmapData,
          max: Math.max(...heatmapData.map(d => d.count)) || 100,
        })

        if (heatmapVisible) heatmap.show()
        else heatmap.hide()

        setMapLoaded(true)
      } catch (error) {
        console.error('Map initialization detailed error:', error)
        setMapError(true)
      }
    }

    if (window.AMap) {
      initMap()
    } else {
      const checkAMap = setInterval(() => {
        if (window.AMap) {
          clearInterval(checkAMap)
          initMap()
        }
      }, 500)

      setTimeout(() => {
        clearInterval(checkAMap)
        if (!window.AMap) setMapError(true)
      }, 10000)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (heatmapRef.current && heatmapVisible && mapLoaded) {
      const data = storesData.map((store) => ({
        lng: store.longitude,
        lat: store.latitude,
        count: heatmapType === 'sales' ? store.todaySales : store.todayCustomers,
      }))

      const maxCount = heatmapType === 'sales'
        ? Math.max(...storesData.map((s) => s.todaySales))
        : Math.max(...storesData.map((s) => s.todayCustomers))

      heatmapRef.current.setDataSet({
        data,
        max: maxCount,
      })
    }
  }, [heatmapType, heatmapVisible, mapLoaded])

  useEffect(() => {
    if (heatmapRef.current) {
      if (heatmapVisible) {
        heatmapRef.current.show()
      } else {
        heatmapRef.current.hide()
      }
    }
  }, [heatmapVisible])

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store)
    if (mapRef.current) {
      mapRef.current.setCenter([store.longitude, store.latitude])
      mapRef.current.setZoom(15)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      <div className="flex-1 relative bg-gray-100 rounded-xl overflow-hidden">
        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">地图加载失败</p>
              <p className="text-sm text-gray-400 mt-2">请检查网络连接或刷新页面</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={mapContainerRef} className="w-full h-full" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">地图加载中...</p>
                </div>
              </div>
            )}

            {mapLoaded && (
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setHeatmapVisible(!heatmapVisible)}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      heatmapVisible
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    热力图
                  </button>
                </div>

                {heatmapVisible && (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setHeatmapType('sales')}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
                        heatmapType === 'sales'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      销量热力
                    </button>
                    <button
                      onClick={() => setHeatmapType('customers')}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors mt-1 ${
                        heatmapType === 'customers'
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      客流热力
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <div className="text-xs text-gray-500 mb-2">热力图例</div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-3 rounded bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>低</span>
                    <span>高</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {selectedStore && (
          <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{selectedStore.name}</h3>
              <button
                onClick={() => setSelectedStore(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{selectedStore.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedStore.manager}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedStore.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{selectedStore.openTime}</span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">今日销售额</p>
                    <p className="text-lg font-semibold text-primary-600">
                      {formatCurrency(selectedStore.todaySales)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">今日客流</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedStore.todayCustomers} 人
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {selectedStore.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">门店列表</h2>
          <p className="text-sm text-gray-500 mt-1">共 {storesData.length} 家门店</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {storesData.map((store) => (
            <button
              key={store.id}
              onClick={() => handleStoreClick(store as Store)}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedStore?.id === store.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {store.name.replace('燃厚蛋糕 - ', '')}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 truncate">{store.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-primary-600 font-medium">
                      {formatCurrency(store.todaySales)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {store.todayCustomers}人
                    </span>
                  </div>
                </div>
                <Navigation className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
