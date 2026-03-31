import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import salesTrendData from '@/data/salesTrend.json'

export function SalesTrendChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['销售额', '订单数', '客流'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: salesTrendData.dates,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额(元)',
        position: 'left',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#6b7280',
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`,
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
          },
        },
      },
      {
        type: 'value',
        name: '数量',
        position: 'right',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#6b7280',
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: salesTrendData.sales,
        itemStyle: {
          color: '#e1584e',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(225, 88, 78, 0.3)' },
              { offset: 1, color: 'rgba(225, 88, 78, 0.05)' },
            ],
          },
        },
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: salesTrendData.orders,
        itemStyle: {
          color: '#ff9c37',
        },
      },
      {
        name: '客流',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: salesTrendData.customers,
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
  }

  return (
    <div className="card h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">销量趋势</h3>
      <div className="flex-1 min-h-0">
        {mounted && <ReactECharts option={option} style={{ height: '100%', minHeight: '320px' }} />}
      </div>
    </div>
  )
}
