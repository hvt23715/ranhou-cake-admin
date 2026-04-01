import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, TrendingUp, MapPin, AlertCircle, BookOpen, Search, PieChart, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchAIResponse, fetchAIResponseStream } from '@/lib/ai'
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  {
    category: '业绩分析',
    icon: TrendingUp,
    questions: ['分析今日整体客单价表现', '哪个单品今日贡献额最高？', '销售冠军门店的成功逻辑是什么？'],
  },
  {
    category: '智能运营',
    icon: Sparkles,
    questions: ['如何针对目前的客单价提高连带率？', '根据今日单品销量给出的补货建议', '分析品类销售占比并建议明天的排产'],
  },
  {
    category: '风险预警',
    icon: ShieldCheck,
    questions: ['列出今日最紧急的未处理预警', '分析净月大学城店目前的运行状态', '总结目前的库存缺货情况'],
  },
  {
    category: '行业探索',
    icon: Search,
    questions: ['对比我们目前爆款单品与行业趋势', '搜索2024年流行蛋糕口味', '如何利用现有数据优化会员复购？'],
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 您好！我是“燃厚蛋糕”的首席经营分析师。我已经接入了 DeepSeek 联网搜索能力，不仅能帮您实时监控 18 家门店的经营状况，还能为您提供全球烘焙行业的最新资讯和专业运营建议。\n\n您可以询问我关于**销售数据、库存分析、违规预警**或**行业趋势**的任何问题。请问有什么可以帮您的？',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, assistantMessage])

    try {
      let fullContent = ''
      for await (const chunk of fetchAIResponseStream(content)) {
        fullContent += chunk
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullContent } 
              : msg
          )
        )
      }
    } catch (error) {
      console.error('AI Stream Error:', error)
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === assistantMessageId 
            ? { ...msg, content: '抱歉，我现在处理信息时遇到了点困难，请稍后再试。' } 
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI助手</h1>
        <p className="text-gray-500 mt-1">智能数据分析与运营建议</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <div className="text-sm leading-relaxed">
                    {message.content ? (
                      <MarkdownRenderer content={message.content} isUser={message.role === 'user'} />
                    ) : (isLoading && message.role === 'assistant' && message.id === messages[messages.length - 1].id ? (
                      <div className="flex gap-1 py-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : null)}
                  </div>
                  <span className="text-[10px] opacity-40 mt-1.5 block text-right">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">我</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的问题..."
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                发送
              </button>
            </div>
          </form>
        </div>

        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-y-auto hidden lg:block">
          <h3 className="font-semibold text-gray-900 mb-4">建议问题</h3>
          <div className="space-y-4">
            {suggestedQuestions.map((category) => (
              <div key={category.category}>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <category.icon className="w-4 h-4 text-primary-500" />
                  {category.category}
                </div>
                <div className="space-y-1">
                  {category.questions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSend(question)}
                      className="w-full text-left text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
