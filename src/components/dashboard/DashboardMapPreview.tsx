import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, Store, Loader2, TrendingUp } from 'lucide-react'
import storesData from '@/data/stores.json'

export function DashboardMapPreview() {
  const navigate = useNavigate()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const heatmapRef = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      if (!window.AMap || !mapContainerRef.current) return

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
          zoom: 10,
          center: [125.3238, 43.8965],
          viewMode: '2D',
          mapStyle: 'amap://styles/light',
          dragEnable: false,
          zoomEnable: false,
          scrollWheel: false,
          doubleClickZoom: false,
          touchZoom: false,
        })
        mapRef.current = map

        // 添加门店标记
        storesData.forEach((store) => {
          const marker = new window.AMap.Marker({
            position: [store.longitude, store.latitude],
            content: `<div class="w-1.5 h-1.5 bg-white rounded-full border border-gray-400 shadow-sm opacity-60"></div>`,
            offset: new window.AMap.Pixel(-3, -3),
          })
          marker.setMap(map)
        })

        // 初始化热力图
        const heatmap = new window.AMap.HeatMap(map, {
          radius: 40,
          opacity: [0, 0.7],
          zIndex: 100,
          gradient: {
            0.4: 'rgb(51, 102, 255)',
            0.6: 'rgb(102, 255, 153)',
            0.8: 'rgb(255, 255, 102)',
            1.0: 'rgb(255, 51, 51)',
          }
        })
        heatmapRef.current = heatmap

        const heatmapData = storesData.map((store) => ({
          lng: store.longitude,
          lat: store.latitude,
          count: store.todaySales,
        }))

        heatmap.setDataSet({
          data: heatmapData,
          max: Math.max(...heatmapData.map(d => d.count)) || 100,
        })

        setMapLoaded(true)
      } catch (error) {
        console.error('Dashboard map init error:', error)
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
      return () => clearInterval(checkAMap)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
      }
    }
  }, [])

  const topStore = useMemo(() => {
    return [...storesData].sort((a, b) => b.todaySales - a.todaySales)[0]
  }, [])

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">门店分布</h3>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          查看全域地图
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 rounded-lg overflow-hidden relative min-h-[180px] border border-gray-100 bg-gray-50">
        {/* 高德地图容器 */}
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
              <p className="text-[10px] text-gray-400 font-medium">地图引擎加载中...</p>
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] text-emerald-600 rounded border border-emerald-100 shadow-sm font-semibold">
            实时·长春
          </span>
        </div>
        
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-gray-100 z-10">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <Store className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="text-gray-600">
                销量冠军: <span className="font-bold text-gray-900">{topStore.name.replace('燃厚蛋糕 - ', '')}</span>
              </span>
            </div>
            <div className="flex-shrink-0 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">
              共{storesData.length}家
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-500 font-medium">营业中</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-gray-500 font-medium">装修中</span>
          </div>
        </div>
        <span className="text-gray-400 italic">基于高德地图实时渲染</span>
      </div>
    </div>
  )
}
