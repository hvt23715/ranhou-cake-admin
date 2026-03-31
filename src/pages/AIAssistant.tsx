import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, TrendingUp, MapPin, AlertCircle, BookOpen } from 'lucide-react'
import { cn, generateAIResponse } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  {
    category: '数据查询',
    icon: TrendingUp,
    questions: ['今日销售额是多少？', '哪个门店销量最好？', '各品类销售情况如何？'],
  },
  {
    category: '运营建议',
    icon: Sparkles,
    questions: ['如何提高客单价？', '明天应该备多少货？', '如何提升门店业绩？'],
  },
  {
    category: '行业知识',
    icon: BookOpen,
    questions: ['烘焙行业趋势如何？', '什么蛋糕最受欢迎？', '如何制作提拉米苏？'],
  },
  {
    category: '违规检测',
    icon: AlertCircle,
    questions: ['有哪些违规预警？', '查看摄像头监控', '操作间卫生情况'],
  },
  {
    category: '地理洞察',
    icon: MapPin,
    questions: ['附近有哪些门店？', '门店分布情况', '哪个区域销量最好？'],
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是燃厚蛋糕AI助手 🤖\n\n我可以帮您查询数据、分析业绩、提供运营建议。请问有什么可以帮您的？',
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
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const response = generateAIResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
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
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
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
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
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
