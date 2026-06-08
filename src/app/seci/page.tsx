'use client'

import { useState } from 'react'
import { Users, Edit3, GitMerge, Download, ArrowRight, Circle } from 'lucide-react'
import { mockKnowledgeUnits } from '@/lib/mock-data'
import { SECI_STAGE_LABELS } from '@/lib/types'
import type { SECIStage } from '@/lib/types'

const quadrants: { stage: SECIStage; icon: React.ReactNode; desc: string; items: string[] }[] = [
  {
    stage: 'socialization',
    icon: <Users className="w-4 h-4" />,
    desc: '隐性知识 → 隐性知识',
    items: ['专家对话', '用户访谈', '团队讨论', '经验交流'],
  },
  {
    stage: 'externalization',
    icon: <Edit3 className="w-4 h-4" />,
    desc: '隐性知识 → 显性知识',
    items: ['观点提炼', '概念抽取', '方法总结', '经验卡片'],
  },
  {
    stage: 'combination',
    icon: <GitMerge className="w-4 h-4" />,
    desc: '显性知识 → 显性知识',
    items: ['知识图谱', '方法论体系', '案例库', '专题知识包'],
  },
  {
    stage: 'internalization',
    icon: <Download className="w-4 h-4" />,
    desc: '显性知识 → 隐性知识',
    items: ['用户应用', '决策使用', '复盘反馈', '能力成长'],
  },
]

const stageColors: Record<SECIStage, string> = {
  socialization: 'border-[color:var(--color-accent)]',
  externalization: 'border-[color:var(--color-methodology)]',
  combination: 'border-[color:var(--color-industry)]',
  internalization: 'border-[color:var(--color-case)]',
}

const stageColorsBg: Record<SECIStage, string> = {
  socialization: 'bg-[rgba(108,140,255,0.04)]',
  externalization: 'bg-[rgba(78,205,196,0.04)]',
  combination: 'bg-[rgba(255,217,61,0.04)]',
  internalization: 'bg-[rgba(255,107,107,0.04)]',
}

export default function SECIPage() {
  const [selectedStage, setSelectedStage] = useState<SECIStage | null>(null)

  const stageUnits = selectedStage
    ? mockKnowledgeUnits.filter((u) => u.seciStage === selectedStage)
    : []

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">SECI 知识螺旋</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          知识从隐性经验到显性资产，再到内化能力的持续转化过程
        </p>
      </div>

      {/* Four Quadrants */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {quadrants.map((q) => (
          <button
            key={q.stage}
            onClick={() => setSelectedStage(selectedStage === q.stage ? null : q.stage)}
            className={`card p-5 text-left border-l-2 transition-all ${stageColors[q.stage]} ${stageColorsBg[q.stage]} ${
              selectedStage === q.stage ? 'border-l-[3px] bg-[color:var(--color-surface-raised)]' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-[color:var(--color-surface-raised)] flex items-center justify-center ${
                q.stage === 'socialization' ? 'text-[color:var(--color-accent)]' :
                q.stage === 'externalization' ? 'text-[color:var(--color-methodology)]' :
                q.stage === 'combination' ? 'text-[color:var(--color-industry)]' :
                'text-[color:var(--color-case)]'
              }`}>
                {q.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{SECI_STAGE_LABELS[q.stage]}</h3>
                <p className="text-[10px] text-[color:var(--color-text-muted)]">{q.desc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {q.items.map((item) => (
                <span key={item} className="text-[10px] px-2 py-1 rounded bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)]">
                  {item}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Flow Arrow */}
      <div className="flex items-center justify-center gap-6 mb-8 text-[color:var(--color-text-muted)]">
        <Circle className="w-2 h-2 fill-[color:var(--color-accent)]" />
        <ArrowRight className="w-4 h-4" />
        <Circle className="w-2 h-2 fill-[color:var(--color-methodology)]" />
        <ArrowRight className="w-4 h-4" />
        <Circle className="w-2 h-2 fill-[color:var(--color-industry)]" />
        <ArrowRight className="w-4 h-4" />
        <Circle className="w-2 h-2 fill-[color:var(--color-case)]" />
      </div>

      {/* Selected Stage Units */}
      {selectedStage && (
        <div className="card p-4 animate-in">
          <h3 className="text-sm font-semibold mb-3">
            处于 {SECI_STAGE_LABELS[selectedStage]} 阶段的知识单元
          </h3>
          {stageUnits.length > 0 ? (
            <div className="space-y-2">
              {stageUnits.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[color:var(--color-surface-raised)] text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className={`badge-${u.type} text-[10px] px-1.5 py-0.5 rounded font-medium`}>
                      {u.type === 'concept' ? '概念' : u.type === 'methodology' ? '方法论' : u.type === 'industry_profession' ? '行业' : '案例'}
                    </span>
                    <span>{u.name}</span>
                  </div>
                  <span className="text-[10px] text-[color:var(--color-text-muted)]">可信度 {(u.confidence * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[color:var(--color-text-muted)]">暂无处于该阶段的知识单元</p>
          )}
        </div>
      )}
    </div>
  )
}
