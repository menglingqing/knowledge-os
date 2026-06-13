'use client'

import { useState } from 'react'
import { ShieldCheck, Check, X, Edit3, GitMerge, Archive, Search } from 'lucide-react'
import { mockKnowledgeUnits } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'

type Tab = 'review' | 'units' | 'tags' | 'relations' | 'merge'

const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
  { key: 'review', label: '候选审核', icon: <ShieldCheck className="w-3.5 h-3.5" />, count: mockKnowledgeUnits.filter(u => u.status === 'candidate').length },
  { key: 'units', label: '知识单元', icon: <Edit3 className="w-3.5 h-3.5" />, count: mockKnowledgeUnits.length },
  { key: 'tags', label: '标签维护', icon: <Edit3 className="w-3.5 h-3.5" /> },
  { key: 'relations', label: '关系维护', icon: <GitMerge className="w-3.5 h-3.5" /> },
  { key: 'merge', label: '合并归档', icon: <Archive className="w-3.5 h-3.5" /> },
]

export default function GovernancePage() {
  const [tab, setTab] = useState<Tab>('review')
  const candidates = mockKnowledgeUnits.filter((u) => u.status === 'candidate')
  const approved = mockKnowledgeUnits.filter((u) => u.status === 'approved')

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 animate-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">知识治理</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">审核候选知识，维护知识质量</p>
      </div>

      {/* Tabs */}
      <nav className="flex gap-0.5 mb-6 border-b border-[color:var(--color-border)]" role="tablist" aria-label="治理功能">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            role="tab"
            aria-selected={tab === t.key}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-t-lg -mb-px border-b-2 transition-all min-h-[40px] ${
              tab === t.key
                ? 'border-[color:var(--color-accent)] text-[color:var(--color-accent)]'
                : 'border-transparent text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-hover)]'
            }`}
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                tab === t.key ? 'bg-[color:var(--color-accent-glow)]' : 'bg-[color:var(--color-surface-raised)]'
              }`} aria-label={`${t.count} 条`}>{t.count}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Review Tab */}
      {tab === 'review' && (
        <div className="space-y-2" role="tabpanel" aria-label="候选审核">
          {candidates.length === 0 ? (
            <div className="text-center py-16 text-sm text-[color:var(--color-text-muted)]">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-20" aria-hidden="true" />
              <p>暂无待审核知识</p>
            </div>
          ) : (
            candidates.map((unit) => (
              <div key={unit.id} className="card p-5 stagger-in">
                <div className="flex items-start gap-4">
                  <span className={`badge-${unit.type} text-[10px] px-2 py-0.5 rounded-full font-medium mt-0.5 shrink-0`}>
                    {KNOWLEDGE_TYPE_LABELS[unit.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1.5">{unit.name}</h3>
                    <p className="text-xs text-[color:var(--color-text-secondary)] mb-2.5 leading-relaxed">{unit.description}</p>
                    <div className="flex items-center gap-4 text-[10px] text-[color:var(--color-text-muted)]">
                      <span>可信度 {(unit.confidence * 100).toFixed(0)}%</span>
                      <span>来源: {unit.sourceDocumentIds.length} 个文档</span>
                      <span>创建: {new Date(unit.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="btn p-2 bg-[color:var(--color-success-bg)] text-[color:var(--color-success)] hover:bg-[rgba(78,205,196,0.2)] min-w-[40px] min-h-[40px]" aria-label={`通过 ${unit.name}`}>
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="btn p-2 bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger)] hover:bg-[rgba(255,123,123,0.2)] min-w-[40px] min-h-[40px]" aria-label={`拒绝 ${unit.name}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Units Tab */}
      {tab === 'units' && (
        <div className="space-y-1.5" role="tabpanel" aria-label="知识单元管理">
          {approved.map((unit) => (
            <div key={unit.id} className="card p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`badge-${unit.type} text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0`}>
                  {KNOWLEDGE_TYPE_LABELS[unit.type]}
                </span>
                <span className="text-sm truncate">{unit.name}</span>
              </div>
              <button className="btn btn-ghost p-2" aria-label={`编辑 ${unit.name}`}>
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder tabs */}
      {['tags', 'relations', 'merge'].includes(tab) && (
        <div className="text-center py-16 text-sm text-[color:var(--color-text-muted)]" role="tabpanel" aria-label={tabs.find(t => t.key === tab)?.label}>
          <p>{tabs.find(t => t.key === tab)?.label}功能即将上线</p>
        </div>
      )}
    </div>
  )
}
