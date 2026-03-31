import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, Store } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import storesData from '@/data/stores.json'
import { formatCurrency } from '@/lib/utils'

export function DashboardMapPreview() {
  const navigate = useNavigate()

  const scatterData = useMemo(() => {
    return storesData.map((store) => ({
      name: store.name.replace('燃厚蛋糕 - ', ''),
      value: [store.longitude, store.latitude, store.todaySales],
      sales: store.todaySales,
      customers: store.todayCustomers,
    }))
  }, [])

  const option = useMemo(() => {
    const minSales = Math.min(...scatterData.map((d) => d.sales))
    const maxSales = Math.max(...scatterData.map((d) => d.sales))

    return {
      grid: {
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '10%',
      },
      xAxis: {
        type: 'value',
        min: 125.1,
        max: 125.45,
        show: false,
      },
      yAxis: {
        type: 'value',
        min: 43.75,
        max: 44.0,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
          fontSize: 12,
        },
        formatter: (params: any) => {
          return `
            <div style="font-weight:600;margin-bottom:4px">${params.data.name}</div>
            <div style="color:#6b7280">销售额: ${formatCurrency(params.data.sales)}</div>
            <div style="color:#6b7280">客流: ${params.data.customers}人</div>
          `
        },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: (val: number[]) => {
            const sales = val[2]
            const size = 8 + ((sales - minSales) / (maxSales - minSales)) * 20
            return Math.max(10, Math.min(30, size))
          },
          data: scatterData,
          itemStyle: {
            color: (params: any) => {
              const sales = params.data.sales
              const ratio = (sales - minSales) / (maxSales - minSales)
              if (ratio > 0.7) return '#ef4444'
              if (ratio > 0.4) return '#f59e0b'
              return '#3b82f6'
            },
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
          },
          emphasis: {
            scale: 1.5,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
        },
      ],
    }
  }, [scatterData])

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
          查看地图
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative min-h-[180px]">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <Store className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-gray-600">共 {storesData.length} 家门店</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              销量冠军: <span className="font-medium text-emerald-600">{topStore.name.replace('燃厚蛋糕 - ', '')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-500">低销量</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-500">中销量</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-500">高销量</span>
          </div>
        </div>
      </div>
    </div>
  )
}
