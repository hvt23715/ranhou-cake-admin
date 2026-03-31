import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import categoriesData from '@/data/categories.json'

export function CategoryChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categoriesData.map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    yAxis: {
      type: 'value',
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
    series: [
      {
        name: '销售额',
        type: 'bar',
        barWidth: '50%',
        data: categoriesData.map((item) => ({
          value: item.todaySales,
          itemStyle: {
            color: item.color,
            borderRadius: [4, 4, 0, 0],
          },
        })),
      },
    ],
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">品类销量</h3>
      {mounted && <ReactECharts option={option} style={{ height: '280px' }} />}
    </div>
  )
}
