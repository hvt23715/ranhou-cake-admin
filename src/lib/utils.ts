import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import storesData from '@/data/stores.json'
import categoriesData from '@/data/categories.json'
import salesTrendData from '@/data/salesTrend.json'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN').format(value)
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function generateAIResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('销售额') || q.includes('收入') || q.includes('业绩')) {
    const todaySales = salesTrendData.sales[salesTrendData.sales.length - 1]
    const yesterdaySales = salesTrendData.sales[salesTrendData.sales.length - 2]
    const growth = ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(1)
    return `今日销售额为 **${formatCurrency(todaySales)}**，较昨日${Number(growth) >= 0 ? '增长' : '下降'} **${Math.abs(Number(growth))}%**。`
  }

  if (q.includes('门店') && (q.includes('最好') || q.includes('第一') || q.includes('销量'))) {
    const topStore = [...storesData].sort((a, b) => b.todaySales - a.todaySales)[0]
    return `今日销量最好的门店是 **${topStore.name}**，销售额为 **${formatCurrency(topStore.todaySales)}**，客流 **${topStore.todayCustomers}** 人次。`
  }

  if (q.includes('品类') || q.includes('分类') || q.includes('产品')) {
    const topCategory = [...categoriesData].sort((a, b) => b.todaySales - a.todaySales)[0]
    return `各品类今日销售情况：\n\n${categoriesData.map(c => `- **${c.name}**：${formatCurrency(c.todaySales)}（${c.todayOrders}单）`).join('\n')}\n\n销量最好的品类是 **${topCategory.name}**。`
  }

  if (q.includes('订单') || q.includes('单量')) {
    const todayOrders = salesTrendData.orders[salesTrendData.orders.length - 1]
    return `今日订单数为 **${formatNumber(todayOrders)}** 单，较昨日增长 **8.3%**。`
  }

  if (q.includes('客单价')) {
    const todaySales = salesTrendData.sales[salesTrendData.sales.length - 1]
    const todayOrders = salesTrendData.orders[salesTrendData.orders.length - 1]
    const avgPrice = Math.round(todaySales / todayOrders)
    return `今日客单价为 **${formatCurrency(avgPrice)}**，较昨日增长 **5.2%**。`
  }

  if (q.includes('门店') && q.includes('多少')) {
    return `目前共有 **${storesData.length}** 家门店，全部处于营业中状态。`
  }

  if (q.includes('违规') || q.includes('预警') || q.includes('告警')) {
    return `当前有 **3** 条未处理预警：\n\n1. **库存预警** - 重庆路旗舰店 草莓慕斯蛋糕 库存不足\n2. **违规检测** - 红旗街店 检测到员工未佩戴工作帽\n3. **设备告警** - 净月大学城店 2号冷藏柜温度异常\n\n请及时处理！`
  }

  if (q.includes('备货') || q.includes('库存') || q.includes('进货')) {
    return `根据历史销售数据分析，建议明日备货：\n\n- 生日蛋糕：约 **180** 份\n- 面包：约 **450** 个\n- 甜点：约 **320** 份\n- 饮品：约 **280** 杯\n\n考虑到明天天气晴朗，预计客流会有所增加，建议适当增加备货量。`
  }

  if (q.includes('提高') || q.includes('提升') || q.includes('建议')) {
    return `提升业绩的建议：\n\n1. **优化产品组合**：根据数据，生日蛋糕和节日礼盒销量最好，可增加相关推广\n2. **会员营销**：建立会员体系，提高复购率\n3. **时段促销**：下午茶时段（14:00-17:00）推出饮品+甜点套餐\n4. **节日营销**：提前准备节日礼盒，抓住节日销售高峰\n5. **门店培训**：加强服务培训，提升顾客体验`
  }

  if (q.includes('趋势') || q.includes('行业')) {
    return `烘焙行业当前趋势：\n\n1. **健康化**：低糖、低脂、无添加产品越来越受欢迎\n2. **个性化**：定制蛋糕需求持续增长\n3. **便捷化**：小份装、即食类产品销量上升\n4. **数字化**：线上订单占比逐年提升\n5. **体验化**：门店体验成为差异化竞争关键\n\n建议关注这些趋势，及时调整产品策略。`
  }

  if (q.includes('地图') || q.includes('位置') || q.includes('分布')) {
    return `门店主要分布在长春市的以下区域：\n\n- **朝阳区**：6家门店（重庆路、红旗街、桂林路等核心商圈）\n- **南关区**：3家门店\n- **宽城区**：3家门店\n- **二道区**：2家门店\n- **绿园区**：3家门店\n- **高新区**：2家门店\n- **净月区**：1家门店\n\n可在地图页面查看详细分布。`
  }

  return `感谢您的提问！我是燃厚蛋糕AI助手，可以帮您：\n\n- 查询销售数据和门店信息\n- 提供运营建议和备货指导\n- 分析行业趋势和竞品情况\n- 查看违规预警和监控信息\n\n请从下方选择问题类型，或直接输入您想了解的内容。`
}
