import storesData from '@/data/stores.json'
import categoriesData from '@/data/categories.json'
import salesTrendData from '@/data/salesTrend.json'
import skuSalesData from '@/data/skuSales.json'
import alertsData from '@/data/alerts.json'
import { formatCurrency, formatNumber } from './utils'

const API_KEY = import.meta.env.VITE_LLM_API_KEY
const BASE_URL = import.meta.env.VITE_LLM_BASE_URL
const MODEL = import.meta.env.VITE_LLM_MODEL

// 计算经营指标
const todaySales = salesTrendData.sales[salesTrendData.sales.length - 1]
const todayOrders = salesTrendData.orders[salesTrendData.orders.length - 1]
const aov = todayOrders > 0 ? (todaySales / todayOrders) : 0
const topSKUs = [...skuSalesData].sort((a, b) => b.todaySales - a.todaySales).slice(0, 3)
const unreadAlerts = alertsData.filter(a => a.status === 'unread')
const alertSummary = unreadAlerts.reduce((acc: any, curr: any) => {
  acc[curr.type] = (acc[curr.type] || 0) + 1
  return acc
}, {})

const SYSTEM_PROMPT = `你是一位专业的“燃厚蛋糕”连锁店经营分析助手。
你的目标是帮助店长和管理层通过数据洞察经营现状，提供精准的分析建议。

当前品牌经营实时快报：
1. 核心规模：全国 ${storesData.length} 家门店，今日实时总额 ${formatCurrency(todaySales)}。
2. 效率指标：总订单 ${formatNumber(todayOrders)} 笔，客单价（AOV）为 ${formatCurrency(aov)}。
3. 门店表现：销售冠军为 [${[...storesData].sort((a, b) => b.todaySales - a.todaySales)[0].name}]，今日销售 ${formatCurrency([...storesData].sort((a, b) => b.todaySales - a.todaySales)[0].todaySales)}。
4. 单品表现：
   - 销量Top3: ${topSKUs.map(s => `${s.name}(已售${s.todaySales})`).join(', ')}。
   - 缺货提醒: ${skuSalesData.filter(s => s.stock === 0).map(s => s.name).join(', ') || '暂无'}。
5. 风险监控：当前共有 ${unreadAlerts.length} 条未处理预警。
   - 分布：${Object.entries(alertSummary).map(([type, count]) => `${type}: ${count}条`).join(', ') || '运行平稳'}。
   - 最近预警：${unreadAlerts[0]?.message || '无'}。

你的回答规则：
1. **数据驱动**：回答必须深度结合上述提供的经营数据。不要泛泛而谈，要点出具体的门店名、品类名或具体的金额/笔数。
2. **专业洞察**：如果客单价偏低，建议加强附加品（如饮品、甜点）的推销；如果某品类售罄或库存低，提醒补货。
3. **分层回复**：先给出直接答案/结论，再附带具体数据支持，最后提供改进建议。
4. **行业结合**：结合烘焙行业特点（损耗控制、保质期管理、会员活跃度）。
5. **格式规范**：使用 Markdown 格式，适当使用表格展示对比数据，加粗关键指标。`

export async function fetchAIResponse(message: string): Promise<string> {
  if (!API_KEY || !BASE_URL) {
    return "AI 配置缺失，请检查环境变量设置。"
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI API Error:', error)
    return "抱歉，我现在处理信息时遇到了点困难，请稍后再试。"
  }
}

export async function* fetchAIResponseStream(message: string): AsyncGenerator<string, void, unknown> {
  if (!API_KEY || !BASE_URL) {
    yield "AI 配置缺失，请检查环境变量设置。"
    return
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let partial = ''

    if (!reader) {
      yield "响应异常，无法建立数据流。"
      return
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = (partial + chunk).split('\n')
      partial = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue

        if (trimmedLine.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmedLine.slice(6))
            const content = data.choices[0]?.delta?.content || ''
            if (content) {
              yield content
            }
          } catch (e) {
            console.error('Error parsing SSE line:', trimmedLine, e)
          }
        }
      }
    }
  } catch (error) {
    console.error('AI Stream Error:', error)
    yield "抱歉，我现在处理信息时遇到了点困难，请稍后再试。"
  }
}
