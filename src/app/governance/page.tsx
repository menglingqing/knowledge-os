'use client'

import { useState } from 'react'
import { ShieldCheck, Check, X, Edit3, GitMerge, Archive } from 'lucide-react'
import { mockKnowledgeUnits } from '@/lib/mock-data'
import { KNOWLEDGE_TYPE_LABELS } from '@/lib/types'

type Tab = 'review' | 'units' | 'tags' | 'relations' | 'merge'

export default function GovernancePage() {
  const [tab, setTab] = useState<Tab>('review')
  const candidates = mockKnowledgeUnits.filter((u) => u.status === 'candidate')
  const approved = mockKnowledgeUnits.filter((u) => u.status === 'approved')

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'review', label: '候选审核', icon: <ShieldCheck className="w-3.5 h-3.5" />, count: candidates.length },
    { key: 'units', label: '知识单元', icon: <Edit3 className="w-3.5 h-3.5" />, count: mockKnowledgeUnits.length },
    { key: 'tags', label: '标签维护', icon: <Edit3 className="w-3.5 h-3.5" /> },
    { key: 'relations', label: '关系维护', icon: <GitMerge className="w-3.5 h-3.5" /> },
    { key: 'merge', label: '合并归档', icon: <Archive className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">知识治理</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          审核候选知识，维护知识质量
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[color:var(--color-border)] pb-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-t-lg -mb-px border-b-2 transition-all ${
              tab === t.key
                ? 'border-[color:var(--color-accent)] text-[color:var(--color-accent)]'
                : 'border-transparent text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)]'
            }`}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span className="text-[10px] px-1 py-0.5 rounded-full bg-[color:var(--color-surface-raised)]">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Review Tab */}
      {tab === 'review' && (
        <div className="space-y-2">
          {candidates.length === 0 ? (
            <div className="text-center py-12 text-sm text-[color:var(--color-text-muted)]">
              <ShieldCheck className="w-8 h-8 mx-auto mb-3 opacity-30" />
              暂无待审核知识
            </div>
          ) : (
            candidates.map((unit) => (
              <div key={unit.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <span className={`badge-${unit.type} text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5`}>
                    {KNOWLEDGE_TYPE_LABELS[unit.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1">{unit.name}</h3>
                    <p className="text-xs text-[color:var(--color-text-secondary)] mb-2">{unit.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[color:var(--color-text-muted)]">
                      <span>可信度 {(unit.confidence * 100).toFixed(0)}%</span>
                      <span>来源: {unit.sourceDocumentIds.length} 个文档</span>
                      <span>创建: {new Date(unit.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="p-1.5 rounded-lg bg-[rgba(78,205,196,0.1)] text-[var(--color-success)] hover:bg-[rgba(78,205,196,0.2)]">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-[rgba(255,107,107,0.1)] text-[var(--color-danger)] hover:bg-[rgba(255,107,107,0.2)]">
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
        <div className="space-y-2">
          {approved.map((unit) => (
            <div key={unit.id} className="card p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`badge-${unit.type} text-[10px] px-1.5 py-0.5 rounded font-medium`}>
                  {KNOWLEDGE_TYPE_LABELS[unit.type]}
                </span>
                <span className="text-sm">{unit.name}</span>
              </div>
              <button className="text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-accent)]">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Other Tabs (placeholder) */}
      {tab === 'tags' && (
        <div className="text-center py-12 text-sm text-[color:var(--color-text-muted)]">标签维护功能</div>
      )}
      {tab === 'relations' && (
        <div className="text-center py-12 text-sm text-[color:var(--color-text-muted)]">关系维护功能</div>
      )}
      {tab === 'merge' && (
        <div className="text-center py-12 text-sm text-[color:var(--color-text-muted)]">合并归档功能</div>
      )}
    </div>
  )
}
