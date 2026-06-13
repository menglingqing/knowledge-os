'use client'

import { useState } from 'react'
import {
  Send,
  User,
  Sparkles,
  FileText,
  GitBranch,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Plus,
} from 'lucide-react'
import { mockConversations, mockMessages, mockKnowledgeUnits } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'
import type { Message } from '@/lib/types'

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState(mockConversations[0])
  const messages = mockMessages[activeConv.id] || []
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (input.trim()) setInput('')
  }

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <aside className="w-64 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 overflow-auto" aria-label="对话列表">
        <h3 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[color:var(--color-accent)]" aria-hidden="true" />
          对话列表
        </h3>
        <div className="space-y-1">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              aria-pressed={activeConv.id === conv.id}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all duration-150 min-h-[44px] ${
                activeConv.id === conv.id
                  ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)] ring-1 ring-[rgba(123,150,255,0.2)]'
                  : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)] hover:text-[color:var(--color-text-primary)]'
              }`}
            >
              <div className="font-medium truncate">{conv.title}</div>
              <div className="text-[10px] text-[color:var(--color-text-muted)] mt-0.5">
                {conv.mode === 'normal' ? '知识问答' : conv.mode === 'expert' ? '专家对话' : conv.mode}
              </div>
            </button>
          ))}
        </div>
        <button className="w-full mt-3 py-2 rounded-lg border border-dashed border-[color:var(--color-border)] text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:border-[color:var(--color-border-hover)] transition-colors min-h-[40px] flex items-center justify-center gap-1.5" aria-label="新建对话">
          <Plus className="w-3 h-3" aria-hidden="true" />
          新建对话
        </button>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-12 shrink-0 border-b border-[color:var(--color-border)] flex items-center px-5">
          <h2 className="text-sm font-semibold truncate">{activeConv.title}</h2>
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-muted)] shrink-0">
            {activeConv.mode === 'normal' ? '知识问答' : activeConv.mode === 'expert' ? '专家对话' : activeConv.mode}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-5 space-y-5" role="log" aria-label="对话消息" aria-live="polite">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 backdrop-blur-sm">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
            className="flex gap-2"
          >
            <label htmlFor="chat-input" className="sr-only">输入消息</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入问题，基于知识库回答..."
              className="input flex-1"
            />
            <button
              type="submit"
              className="btn btn-primary w-10 h-10 p-0"
              aria-label="发送消息"
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const isExpert = message.role === 'expert'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`} role="article" aria-label={`${isUser ? '用户' : isExpert ? '专家' : '助手'}消息`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isUser
          ? 'bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)]'
          : isExpert
            ? 'bg-gradient-to-br from-[color:var(--color-expert)] to-[color:var(--color-accent)] shadow-[0_0_12px_rgba(201,154,255,0.2)]'
            : 'bg-[color:var(--color-accent)] shadow-[0_0_12px_rgba(123,150,255,0.2)]'
      }`} aria-hidden="true">
        {isUser ? (
          <User className="w-3.5 h-3.5 text-[color:var(--color-text-muted)]" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      <div className={`max-w-[72%] min-w-0 ${isUser ? 'items-end' : ''}`}>
        {/* Bubble */}
        <div className={`text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
          isUser
            ? 'bg-[color:var(--color-accent)] text-white rounded-tr-md'
            : 'bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] rounded-tl-md text-[color:var(--color-text-primary)]'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {message.citations.map((cit, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-[color:var(--color-text-muted)] px-2 py-1 rounded bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)]">
                <FileText className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span className="truncate">来源: {cit.text.slice(0, 60)}...</span>
              </div>
            ))}
          </div>
        )}

        {/* Related Knowledge */}
        {message.relatedKnowledgeUnitIds && message.relatedKnowledgeUnitIds.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <GitBranch className="w-3 h-3 text-[color:var(--color-text-muted)]" aria-hidden="true" />
            {message.relatedKnowledgeUnitIds.map((id) => {
              const unit = mockKnowledgeUnits.find((u) => u.id === id)
              return (
                <span key={id} className="text-[10px] px-1.5 py-1 rounded bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)]">
                  {unit?.name || id}
                </span>
              )
            })}
          </div>
        )}

        {/* Feedback — only on non-user messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <button className="p-1.5 rounded-lg text-[color:var(--color-text-muted)] hover:text-[color:var(--color-success)] hover:bg-[color:var(--color-success-bg)] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center" aria-label="点赞">
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button className="p-1.5 rounded-lg text-[color:var(--color-text-muted)] hover:text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger-bg)] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center" aria-label="踩">
              <ThumbsDown className="w-3 h-3" />
            </button>
            <button className="p-1.5 rounded-lg text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-glow)] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center" aria-label="收藏到知识库">
              <Bookmark className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
