'use client'

import { useState } from 'react'
import { Search, Filter, ArrowUpRight, Brain, Lightbulb, TrendingUp, FileText } from 'lucide-react'
import { mockKnowledgeUnits } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'
import type { KnowledgeType, UnitStatus } from '@/lib/types'

const typeIcons: Record<KnowledgeType, React.ReactNode> = {
  concept: <Brain className="w-3.5 h-3.5" />,
  methodology: <Lightbulb className="w-3.5 h-3.5" />,
  industry_profession: <TrendingUp className="w-3.5 h-3.5" />,
  case_experience: <FileText className="w-3.5 h-3.5" />,
}

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<KnowledgeType | 'all'>('all')

  const units = mockKnowledgeUnits.filter((u) => {
    if (typeFilter !== 'all' && u.type !== typeFilter) return false
    if (search && !u.name.includes(search) && !u.description.includes(search)) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">知识资产库</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          {mockKnowledgeUnits.length} 个知识单元 · 4 种类型
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索知识单元..."
            className="w-full h-10 pl-9 pr-4 card bg-[color:var(--color-surface-raised)] text-sm placeholder:text-[color:var(--color-text-muted)] focus:outline-none focus:border-[color:var(--color-accent)]"
          />
        </div>
        <div className="flex gap-1">
          {[
            { value: 'all', label: '全部' },
            { value: 'concept', label: '概念' },
            { value: 'methodology', label: '方法论' },
            { value: 'industry_profession', label: '行业' },
            { value: 'case_experience', label: '案例' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value as KnowledgeType | 'all')}
              className={`px-3 py-2 rounded-lg text-xs ${
                typeFilter === opt.value
                  ? 'bg-[color:var(--color-accent)] text-white'
                  : 'card text-[color:var(--color-text-secondary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {units.map((unit) => (
          <div key={unit.id} className="card p-4 flex items-start gap-4 group cursor-pointer">
            <span className={`badge-${unit.type} text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 mt-0.5`}>
              {typeIcons[unit.type]}
              {KNOWLEDGE_TYPE_LABELS[unit.type]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold">{unit.name}</h3>
                {unit.status === 'candidate' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,217,61,0.1)] text-[var(--color-warning)]">待审核</span>
                )}
              </div>
              <p className="text-xs text-[color:var(--color-text-secondary)] line-clamp-2">{unit.description}</p>
              <div className="flex items-center gap-3 mt-2">
                {unit.seciStage && (
                  <span className="text-[10px] text-[color:var(--color-text-muted)]">
                    SECI: {unit.seciStage}
                  </span>
                )}
                <span className="text-[10px] text-[color:var(--color-text-muted)]">
                  可信度 {(unit.confidence * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-[color:var(--color-text-muted)]">
                  {unit.usageCount} 次使用
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                unit.status === 'approved' ? 'text-[var(--color-success)] bg-[rgba(78,205,196,0.1)]' :
                unit.status === 'candidate' ? 'text-[var(--color-warning)] bg-[rgba(255,217,61,0.1)]' :
                'text-[color:var(--color-text-muted)] bg-[color:var(--color-surface-raised)]'
              }`}>
                {unit.status === 'approved' ? '已发布' : unit.status === 'candidate' ? '审核中' : unit.status}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[color:var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
