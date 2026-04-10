'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Send, Loader2, Brain, AlertCircle, MessageSquare, Copy, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { agentClient } from '@/lib/agent-client'

export interface ChatMessage {
  id: string
  projectId: string
  authorId?: string | null
  content: string
  isAiSummary: boolean
  createdAt: Date
}

interface ProjectChatProps {
  projectId: string
  messages: ChatMessage[]
  onMessageSent: (message: ChatMessage) => void
  projectDescription?: string
}

export function ProjectChat({
  projectId,
  messages,
  onMessageSent,
  projectDescription = '',
}: ProjectChatProps) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      projectId,
      authorId: 'current-user',
      content: inputValue,
      isAiSummary: false,
      createdAt: new Date(),
    }

    setLocalMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Отправляем сообщение на сервер
      const response = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userMessage.content,
          isAiSummary: false,
        }),
      })

      if (response.ok) {
        const savedMessage = await response.json()
        setLocalMessages(prev =>
          prev.map(m => m.id === userMessage.id ? savedMessage : m)
        )
        onMessageSent(savedMessage)
      }

      // Получаем ответ от ИИ агента
      const previousContext = localMessages
        .filter(m => m.isAiSummary || m.authorId)
        .map(m => `${m.isAiSummary ? '[AI]' : '[User]'}: ${m.content}`)
        .join('\n\n')

      const aiResponse = await agentClient.processStep({
        step_index: 1, // Researcher для поиска информации
        projectDescription: projectDescription || userMessage.content,
        userFeedback: userMessage.content,
        previousContext: previousContext,
      })

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        projectId,
        authorId: null,
        content: aiResponse,
        isAiSummary: true,
        createdAt: new Date(),
      }

      // Сохраняем ответ ИИ
      const aiResponse2 = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: aiMessage.content,
          isAiSummary: true,
        }),
      })

      if (aiResponse2.ok) {
        const savedAiMessage = await aiResponse2.json()
        setLocalMessages(prev => [...prev, savedAiMessage])
        onMessageSent(savedAiMessage)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Показываем ошибку
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        projectId,
        authorId: null,
        content: '❌ Ошибка при обработке запроса. Попробуйте еще раз.',
        isAiSummary: true,
        createdAt: new Date(),
      }
      setLocalMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border border-slate-100 shadow-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">Нет сообщений</p>
            <p className="text-xs mt-1">Начните диалог с ИИ-ассистентом</p>
          </div>
        ) : (
          localMessages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.isAiSummary ? 'justify-start' : 'justify-end'
              )}
            >
              {message.isAiSummary && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-sm px-4 py-3 rounded-lg',
                  message.isAiSummary
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-primary text-black'
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>

              {message.isAiSummary && (
                <button
                  onClick={() => handleCopyMessage(message.content, message.id)}
                  className="opacity-0 hover:opacity-100 transition-opacity p-1"
                  title="Скопировать"
                >
                  {copiedId === message.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
            <div className="bg-slate-100 rounded-lg px-4 py-3">
              <p className="text-sm text-slate-600 italic">ИИ-ассистент думает...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Опишите вопрос или задачу для ИИ-ассистента..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="h-10 text-xs"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-10 w-10 p-0 bg-primary text-black hover:bg-yellow-400 rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          💡 ИИ-ассистент проведет исследование и предоставит рекомендации
        </p>
      </div>
    </div>
  )
}

