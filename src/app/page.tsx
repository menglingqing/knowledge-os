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
  Sparkles,
} from 'lucide-react'
import { mockDocuments, mockKnowledgeUnits, mockAnalytics } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'
import type { KnowledgeType } from '@/lib/types'

const typeIcons: Record<KnowledgeType, React.ReactNode> = {
  concept: <Brain className="w-3 h-3" />,
  methodology: <Lightbulb className="w-3 h-3" />,
  industry_profession: <TrendingUp className="w-3 h-3" />,
  case_experience: <FileText className="w-3 h-3" />,
}

const quickEntries = [
  { href: '/graph', icon: GitGraph, label: '知识图谱', desc: '探索知识网络', highlight: true },
  { href: '/chat', icon: MessageSquare, label: '知识对话', desc: '问询你的知识库' },
  { href: '/analytics', icon: BarChart3, label: '成长分析', desc: '知识健康度' },
  { href: '/governance', icon: ShieldCheck, label: '知识治理', desc: '审核与管理' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const recentDocs = mockDocuments.slice(0, 4)
  const recentUnits = mockKnowledgeUnits
    .filter((u) => u.status === 'approved')
    .slice(0, 4)
  const pendingUnits = mockKnowledgeUnits.filter((u) => u.status === 'candidate')

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 animate-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1.5 text-[color:var(--color-text-primary)]">
          工作台
        </h1>
        <p className="text-sm text-[color:var(--color-text-secondary)] leading-relaxed">
          灵枢 Knowledge OS — 让知识持续成长
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <label htmlFor="home-search" className="sr-only">搜索知识库</label>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[color:var(--color-text-muted)] pointer-events-none" aria-hidden="true" />
        <input
          id="home-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入问题，例如：帮我整理 AI Agent 长期记忆的核心方法论..."
          className="w-full h-12 pl-11 pr-4 card bg-[color:var(--color-surface-raised)] text-sm placeholder:text-[color:var(--color-text-muted)] focus:outline-none focus:border-[color:var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-glow)]"
        />
        {/* AI badge */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-[color:var(--color-accent-glow)] text-[10px] text-[color:var(--color-accent)] pointer-events-none" aria-hidden="true">
          <Sparkles className="w-2.5 h-2.5" />
          AI
        </div>
      </div>

      {/* Quick Entry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 stagger-in">
        {quickEntries.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              aria-label={`${card.label}: ${card.desc}`}
              className={`card p-4 card-glow group flex items-center gap-3 ${
                card.highlight ? 'border-[color:var(--color-border-hover)]' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                card.highlight
                  ? 'bg-[color:var(--color-accent-glow)]'
                  : 'bg-[color:var(--color-surface-raised)] group-hover:bg-[color:var(--color-accent-glow)]'
              }`}>
                <Icon className={`w-[18px] h-[18px] transition-colors duration-150 ${
                  card.highlight
                    ? 'text-[color:var(--color-accent)]'
                    : 'text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-accent)]'
                }`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">{card.label}</div>
                <div className="text-xs text-[color:var(--color-text-muted)] truncate">{card.desc}</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-in">
        {/* Recent Uploads */}
        <section className="card p-5" aria-labelledby="recent-uploads-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-uploads-heading" className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[color:var(--color-text-muted)]" aria-hidden="true" />
              最近上传
            </h2>
            <Link
              href="/library"
              className="btn btn-ghost text-xs py-1 px-2"
              aria-label="查看全部上传文档"
            >
              全部 <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-1.5">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm transition-colors duration-150 hover:bg-[color:var(--color-surface-overlay)]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-3.5 h-3.5 text-[color:var(--color-text-muted)] shrink-0" aria-hidden="true" />
                  <span className="truncate">{doc.title}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-3 ${
                  doc.status === 'processed' ? 'status-success' :
                  doc.status === 'parsed' ? 'status-warning' :
                  'text-[color:var(--color-text-muted)] bg-[color:var(--color-surface)]'
                }`}>
                  {doc.status === 'processed' ? '已处理' : doc.status === 'parsed' ? '已解析' : '已上传'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Knowledge Units */}
        <section className="card p-5" aria-labelledby="recent-units-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recent-units-heading" className="text-sm font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4 text-[color:var(--color-text-muted)]" aria-hidden="true" />
              最新知识单元
            </h2>
            <Link
              href="/graph"
              className="btn btn-ghost text-xs py-1 px-2"
              aria-label="查看知识图谱"
            >
              图谱 <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-1.5">
            {recentUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm transition-colors duration-150 hover:bg-[color:var(--color-surface-overlay)]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`badge-${unit.type} text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0`}>
                    {typeIcons[unit.type]}
                    {KNOWLEDGE_TYPE_LABELS[unit.type]}
                  </span>
                  <span className="truncate">{unit.name}</span>
                </div>
                <span className="text-[10px] text-[color:var(--color-text-muted)] shrink-0 ml-3 tabular-nums">
                  {unit.usageCount} 次使用
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pending Reviews */}
      {pendingUnits.length > 0 && (
        <section className="card p-5 mt-4" aria-labelledby="pending-reviews-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="pending-reviews-heading" className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[color:var(--color-warning)]" aria-hidden="true" />
              待审核知识
              <span className="text-[10px] bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)] px-2 py-0.5 rounded-full font-medium" aria-label={`${pendingUnits.length} 条待审核`}>
                {pendingUnits.length}
              </span>
            </h2>
            <Link
              href="/governance"
              className="btn btn-ghost text-xs py-1 px-2"
              aria-label="前往知识治理审核"
            >
              去审核 <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-1.5">
            {pendingUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm transition-colors duration-150 hover:bg-[color:var(--color-surface-overlay)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`badge-${unit.type} text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1`}>
                    {typeIcons[unit.type]}
                    {KNOWLEDGE_TYPE_LABELS[unit.type]}
                  </span>
                  <span>{unit.name}</span>
                </div>
                <span className="text-[10px] text-[color:var(--color-text-muted)] tabular-nums">
                  可信度 {(unit.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
