'use client'

import { mockAnalytics, mockKnowledgeUnits } from '@/lib/mock-data'
import { TrendingUp, Brain, Lightbulb, FileText, GitBranch, MousePointer, Quote, AlertTriangle, Heart, RefreshCw } from 'lucide-react'

const metrics = [
  { label: '知识节点总数', value: mockAnalytics.totalNodes, icon: Brain, color: 'text-[var(--color-accent)]' },
  { label: '本周新增概念', value: mockAnalytics.newConceptsThisWeek, icon: Brain, color: 'text-[var(--color-accent)]' },
  { label: '本周新增方法论', value: mockAnalytics.newMethodologiesThisWeek, icon: Lightbulb, color: 'text-[var(--color-methodology)]' },
  { label: '本周新增案例', value: mockAnalytics.newCasesThisWeek, icon: FileText, color: 'text-[var(--color-case)]' },
  { label: '图谱关系数', value: mockAnalytics.totalRelations, icon: GitBranch, color: 'text-[var(--color-industry)]' },
  { label: '总使用次数', value: mockAnalytics.totalUsageCount, icon: MousePointer, color: 'text-[var(--color-text-secondary)]' },
  { label: '被引用次数', value: mockAnalytics.totalCitationCount, icon: Quote, color: 'text-[var(--color-text-secondary)]' },
  { label: '知识孤岛', value: mockAnalytics.orphanNodes, icon: AlertTriangle, color: 'text-[var(--color-warning)]' },
  { label: '健康度评分', value: `${mockAnalytics.healthScore}/100`, icon: Heart, color: 'text-[var(--color-success)]' },
  { label: 'SECI 转化', value: mockAnalytics.seciConversions, icon: RefreshCw, color: 'text-[var(--color-methodology)]' },
]

const typeDistribution = [
  { type: '概念', count: mockKnowledgeUnits.filter((u) => u.type === 'concept').length, color: '#6c8cff' },
  { type: '方法论', count: mockKnowledgeUnits.filter((u) => u.type === 'methodology').length, color: '#4ecdc4' },
  { type: '行业/职业', count: mockKnowledgeUnits.filter((u) => u.type === 'industry_profession').length, color: '#ffd93d' },
  { type: '案例/经验', count: mockKnowledgeUnits.filter((u) => u.type === 'case_experience').length, color: '#ff6b6b' },
]

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 animate-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">成长分析台</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          追踪知识系统的健康状况和成长趋势
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-[10px] text-[color:var(--color-text-muted)]">{m.label}</span>
              </div>
              <div className="text-2xl font-bold">{m.value}</div>
            </div>
          )
        })}
      </div>

      {/* Distribution & Health */}
      <div className="grid grid-cols-2 gap-4">
        {/* Type Distribution */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-4">知识类型分布</h3>
          <div className="space-y-3">
            {typeDistribution.map((t) => (
              <div key={t.type}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{t.type}</span>
                  <span className="text-[color:var(--color-text-muted)]">{t.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[color:var(--color-surface-raised)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(t.count / mockAnalytics.totalNodes) * 100}%`,
                      background: t.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Overview */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-4">健康度概览</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-[color:var(--color-success)] flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-[color:var(--color-success)]">{mockAnalytics.healthScore}</div>
                <div className="text-[10px] text-[color:var(--color-text-muted)]">/ 100</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 px-3 rounded bg-[color:var(--color-surface-raised)]">
              <span>反馈数量</span>
              <span className="font-medium">{mockAnalytics.feedbackCount}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-3 rounded bg-[color:var(--color-surface-raised)]">
              <span>知识孤岛</span>
              <span className="font-medium text-[color:var(--color-warning)]">{mockAnalytics.orphanNodes}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-3 rounded bg-[color:var(--color-surface-raised)]">
              <span>SECI 转化次数</span>
              <span className="font-medium text-[color:var(--color-methodology)]">{mockAnalytics.seciConversions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
