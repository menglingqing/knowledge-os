'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ArrowUpRight,
  Clock,
  FileText,
  Brain,
  Lightbulb,
  GitGraph,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { mockDocuments, mockKnowledgeUnits, mockAnalytics } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'
import type { KnowledgeType } from '@/lib/types'

const typeIcons: Record<KnowledgeType, React.ReactNode> = {
  concept: <Brain className="w-3.5 h-3.5" />,
  methodology: <Lightbulb className="w-3.5 h-3.5" />,
  industry_profession: <TrendingUp className="w-3.5 h-3.5" />,
  case_experience: <FileText className="w-3.5 h-3.5" />,
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const recentDocs = mockDocuments.slice(0, 4)
  const recentUnits = mockKnowledgeUnits
    .filter((u) => u.status === 'approved')
    .slice(0, 4)
  const pendingUnits = mockKnowledgeUnits.filter((u) => u.status === 'candidate')

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">工作台</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          灵枢 Knowledge OS — 让知识持续成长
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入问题，例如：帮我整理 AI Agent 长期记忆的核心方法论..."
          className="w-full h-12 pl-11 pr-4 card bg-[color:var(--color-surface-raised)] text-sm placeholder:text-[color:var(--color-text-muted)] focus:outline-none focus:border-[color:var(--color-accent)]"
        />
      </div>

      {/* Quick Entry Cards */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { href: '/graph', icon: GitGraph, label: '知识图谱', desc: '探索知识网络' },
          { href: '/chat', icon: MessageSquare, label: '知识对话', desc: '问询你的知识库' },
          { href: '/analytics', icon: BarChart3, label: '成长分析', desc: '知识健康度' },
          { href: '/governance', icon: ShieldCheck, label: '知识治理', desc: `${pendingUnits.length} 条待审核` },
        ].map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="card p-4 card-glow group flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[color:var(--color-surface-raised)] flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-[color:var(--color-text-secondary)] group-hover:text-[color:var(--color-accent)] transition-colors" />
              </div>
              <div>
                <div className="text-sm font-medium">{card.label}</div>
                <div className="text-xs text-[color:var(--color-text-muted)]">{card.desc}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Uploads */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[color:var(--color-text-muted)]" />
              最近上传
            </h2>
            <Link href="/library" className="text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1">
              全部 <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-3.5 h-3.5 text-[color:var(--color-text-muted)] shrink-0" />
                  <span className="truncate">{doc.title}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-2 ${
                  doc.status === 'processed' ? 'text-[var(--color-success)] bg-[rgba(78,205,196,0.1)]' :
                  doc.status === 'parsed' ? 'text-[var(--color-warning)] bg-[rgba(255,217,61,0.1)]' :
                  'text-[var(--color-text-muted)] bg-[color:var(--color-surface)]'
                }`}>
                  {doc.status === 'processed' ? '已处理' : doc.status === 'parsed' ? '已解析' : '已上传'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Knowledge Units */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-[color:var(--color-text-muted)]" />
              最新知识单元
            </h2>
            <Link href="/graph" className="text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1">
              图谱 <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`badge-${unit.type} text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 shrink-0`}>
                    {typeIcons[unit.type]}
                    {KNOWLEDGE_TYPE_LABELS[unit.type]}
                  </span>
                  <span className="truncate">{unit.name}</span>
                </div>
                <span className="text-[10px] text-[color:var(--color-text-muted)] shrink-0 ml-2">
                  {unit.usageCount} 次使用
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      {pendingUnits.length > 0 && (
        <div className="card p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[color:var(--color-warning)]" />
              待审核知识
              <span className="text-[10px] bg-[rgba(255,217,61,0.15)] text-[var(--color-warning)] px-1.5 py-0.5 rounded-full">{pendingUnits.length}</span>
            </h2>
            <Link href="/governance" className="text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1">
              去审核 <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`badge-${unit.type} text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1`}>
                    {typeIcons[unit.type]}
                    {KNOWLEDGE_TYPE_LABELS[unit.type]}
                  </span>
                  <span>{unit.name}</span>
                </div>
                <span className="text-[10px] text-[color:var(--color-text-muted)]">
                  可信度 {(unit.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
