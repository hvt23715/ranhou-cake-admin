import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, ArrowRight, Search, BarChart3, ShieldAlert, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { fetchAIResponse, fetchAIResponseStream } from '@/lib/ai'
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickQuestions = [
  { text: '分析今日经营指标', icon: <BarChart3 className="w-4 h-4 text-blue-500" /> },
  { text: '诊断异常预警', icon: <ShieldAlert className="w-4 h-4 text-orange-500" /> },
  { text: '哪些单品卖得最好？', icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
  { text: '客单价提升建议', icon: <Users className="w-4 h-4 text-green-500" /> },
]

export function DashboardAIChat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior
      })
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      // During loading (streaming), we might want 'auto' for better responsiveness
      // but let's keep 'smooth' for now or try 'auto' if smooth is jumpy
      scrollToBottom(isLoading ? 'auto' : 'smooth')
    }
  }, [messages, isLoading])

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 truncate">AI 智能助手</h3>
        </div>
        <button
          onClick={() => navigate('/ai')}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors flex-shrink-0"
        >
          完整版
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 bg-gray-50 rounded-lg p-3 overflow-hidden flex flex-col min-h-0 relative">
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-200"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-6 px-4 text-center animate-in fade-in duration-700">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100/50">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                您好，我是燃厚经营顾问
              </h2>
              <p className="text-gray-500 text-sm max-w-[280px] mb-8 leading-relaxed">
                我已接入 DeepSeek-v3 与实时联网搜索，随时为您提供深度分析建议。
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {quickQuestions.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSend(q.text)}
                    className="flex flex-col items-start p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all group text-left"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg mb-2 group-hover:bg-blue-50 transition-colors">
                      {q.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-3 h-3 text-primary-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed transition-all duration-200',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                    )}
                  >
                    <MarkdownRenderer 
                      content={message.content || (isLoading && message.role === 'assistant' && message.id === messages[messages.length - 1].id ? '正在思考...' : '')}
                      isUser={message.role === 'user'}
                    />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="h-2" />
            </>
          )}
        </div>
      </div>

      <div className="mt-3 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入问题..."
            className="w-0 flex-1 px-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-all active:scale-95 shadow-sm shadow-primary-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
