'use client'

import { useState } from 'react'
import { mockExperts } from '@/lib/mock-data'
import { User, Sparkles, BookOpen, MessageSquare, ArrowRight } from 'lucide-react'
import type { Expert } from '@/lib/types'

export default function ExpertsPage() {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(mockExperts[0] || null)

  return (
    <div className="flex h-full">
      {/* Expert List */}
      <div className="w-72 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 overflow-auto">
        <h3 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[color:var(--color-expert)]" />
          仿真专家
        </h3>
        <div className="space-y-1.5">
          {mockExperts.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setSelectedExpert(exp)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedExpert?.id === exp.id
                  ? 'bg-[color:var(--color-accent-glow)] border border-[rgba(108,140,255,0.2)]'
                  : 'bg-[color:var(--color-surface-raised)] border border-transparent hover:border-[color:var(--color-border)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-expert)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
                  {exp.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{exp.name}</div>
                  <div className="text-[10px] text-[color:var(--color-text-muted)] truncate">{exp.title}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Expert Detail */}
      {selectedExpert && (
        <div className="flex-1 overflow-auto p-6 animate-in">
          <div className="max-w-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-expert)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xl">
                {selectedExpert.name[0]}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{selectedExpert.name}</h2>
                <p className="text-sm text-[color:var(--color-text-secondary)]">{selectedExpert.title}</p>
              </div>
            </div>

            <p className="text-sm text-[color:var(--color-text-secondary)] leading-relaxed mb-6">
              {selectedExpert.description}
            </p>

            {/* Domain Tags */}
            <div className="mb-6">
              <h4 className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider mb-2">擅长领域</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedExpert.domain.map((d) => (
                  <span key={d} className="text-xs px-2 py-1 rounded-lg bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)]">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Style Profile */}
            {selectedExpert.styleProfile && (
              <div className="mb-6 card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-[color:var(--color-text-muted)]" />
                  <span className="text-xs font-medium">表达风格</span>
                </div>
                <p className="text-xs text-[color:var(--color-text-secondary)]">{selectedExpert.styleProfile}</p>
              </div>
            )}

            {/* Action */}
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <MessageSquare className="w-4 h-4" />
              开始对话
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
