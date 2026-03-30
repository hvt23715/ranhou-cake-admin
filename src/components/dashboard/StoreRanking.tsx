import storesData from '@/data/stores.json'
import { formatCurrency } from '@/lib/utils'

export function StoreRanking() {
  const sortedStores = [...storesData]
    .sort((a, b) => b.todaySales - a.todaySales)
    .slice(0, 10)

  const maxSales = sortedStores[0]?.todaySales || 1

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">门店销量排行</h3>
      <div className="space-y-4">
        {sortedStores.map((store, index) => (
          <div key={store.id} className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index < 3
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {store.name.replace('燃厚蛋糕 - ', '')}
                </span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(store.todaySales)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${(store.todaySales / maxSales) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
