import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  trend: number
  icon: LucideIcon
  prefix?: string
  isCurrency?: boolean
}

export function StatCard({ title, value, trend, icon: Icon, isCurrency }: StatCardProps) {
  const isPositive = trend >= 0

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </p>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{formatPercent(trend)}</span>
        </div>
        <span className="text-sm text-gray-400">较昨日</span>
      </div>
    </div>
  )
}
