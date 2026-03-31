import { DollarSign, Store, ShoppingCart, Users } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SalesTrendChart } from '@/components/dashboard/SalesTrendChart'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { StoreRanking } from '@/components/dashboard/StoreRanking'
import { AlertList } from '@/components/dashboard/AlertList'
import { DashboardAIChat } from '@/components/dashboard/DashboardAIChat'
import { DashboardMapPreview } from '@/components/dashboard/DashboardMapPreview'
import { DashboardCameraPreview } from '@/components/dashboard/DashboardCameraPreview'
import storesData from '@/data/stores.json'
import salesTrendData from '@/data/salesTrend.json'

export default function Dashboard() {
  const totalSales = salesTrendData.sales[salesTrendData.sales.length - 1]
  const totalOrders = salesTrendData.orders[salesTrendData.orders.length - 1]
  const avgOrderValue = Math.round(totalSales / totalOrders)

  const stats = [
    {
      title: '今日销售额',
      value: totalSales,
      trend: 12.5,
      icon: DollarSign,
      isCurrency: true,
    },
    {
      title: '门店数量',
      value: storesData.length,
      trend: 0,
      icon: Store,
      isCurrency: false,
    },
    {
      title: '今日订单',
      value: totalOrders,
      trend: 8.3,
      icon: ShoppingCart,
      isCurrency: false,
    },
    {
      title: '客单价',
      value: avgOrderValue,
      trend: 5.2,
      icon: Users,
      isCurrency: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">首页仪表盘</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看今日经营概况</p>
        </div>
        <div className="text-sm text-gray-500">
          数据更新时间：{new Date().toLocaleString('zh-CN')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-[320px]">
          <DashboardAIChat />
        </div>
        <div className="h-[320px]">
          <DashboardMapPreview />
        </div>
        <div className="h-[320px]">
          <DashboardCameraPreview />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <div>
          <StoreRanking />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <AlertList />
      </div>
    </div>
  )
}
