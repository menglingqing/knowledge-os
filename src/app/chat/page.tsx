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
} from 'lucide-react'
import { mockConversations, mockMessages } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'
import type { Message } from '@/lib/types'

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState(mockConversations[0])
  const messages = mockMessages[activeConv.id] || []
  const [input, setInput] = useState('')

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-64 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 overflow-auto">
        <h3 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[color:var(--color-accent)]" />
          对话列表
        </h3>
        <div className="space-y-1">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                activeConv.id === conv.id
                  ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                  : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)]'
              }`}
            >
              <div className="font-medium truncate">{conv.title}</div>
              <div className="text-[10px] text-[color:var(--color-text-muted)] mt-0.5">
                {conv.mode === 'normal' ? '知识问答' : conv.mode === 'expert' ? '专家对话' : conv.mode}
              </div>
            </button>
          ))}
        </div>
        <button className="w-full mt-3 py-1.5 rounded-lg border border-dashed border-[color:var(--color-border)] text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:border-[color:var(--color-border-active)]">
          + 新建对话
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 shrink-0 border-b border-[color:var(--color-border)] flex items-center px-4">
          <h2 className="text-sm font-semibold">{activeConv.title}</h2>
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-muted)]">
            {activeConv.mode === 'normal' ? '知识问答' : activeConv.mode === 'expert' ? '专家对话' : activeConv.mode}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[color:var(--color-border)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入问题，基于知识库回答..."
              className="flex-1 h-10 px-4 card bg-[color:var(--color-surface-raised)] text-sm placeholder:text-[color:var(--color-text-muted)] focus:outline-none focus:border-[color:var(--color-accent)]"
              onKeyDown={(e) => e.key === 'Enter' && setInput('')}
            />
            <button className="w-10 h-10 rounded-lg bg-[color:var(--color-accent)] text-white flex items-center justify-center hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          message.role === 'expert' ? 'bg-gradient-to-br from-[var(--color-expert)] to-[var(--color-accent)]' :
          'bg-[color:var(--color-accent)]'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
        <div className={`text-xs px-3 py-2 rounded-xl ${
          isUser
            ? 'bg-[color:var(--color-accent)] text-white rounded-br-sm'
            : 'bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] rounded-bl-sm'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-1.5 space-y-0.5">
            {message.citations.map((cit, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-muted)]">
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[200px]">来源: {cit.text.slice(0, 60)}...</span>
              </div>
            ))}
          </div>
        )}

        {/* Related Knowledge */}
        {message.relatedKnowledgeUnitIds && message.relatedKnowledgeUnitIds.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <GitBranch className="w-3 h-3 text-[color:var(--color-text-muted)]" />
            {message.relatedKnowledgeUnitIds.map((id) => (
              <span key={id} className="text-[10px] px-1.5 py-0.5 rounded bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)]">
                {id}
              </span>
            ))}
          </div>
        )}

        {/* Feedback */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5">
            <button className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              <ThumbsDown className="w-3 h-3" />
            </button>
            <button className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              <Bookmark className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-[color:var(--color-surface-raised)] flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-[color:var(--color-text-muted)]" />
        </div>
      )}
    </div>
  )
}
