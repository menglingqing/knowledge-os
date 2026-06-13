'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Brain,
  Lightbulb,
  TrendingUp,
  FileText,
  X,
  Filter,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  GitBranch,
} from 'lucide-react'
import { mockKnowledgeUnits, mockRelations } from '@/lib/mock-data'
import {
  KNOWLEDGE_TYPE_LABELS,
  RELATION_TYPE_LABELS,
  SECI_STAGE_LABELS,
} from '@/lib/types'
import type { KnowledgeUnit, KnowledgeType, RelationType, SECIStage } from '@/lib/types'

// ---- Node Colors (sync with globals.css) ----
const NODE_COLORS: Record<KnowledgeType, string> = {
  concept: '#7b96ff',
  methodology: '#4ecdc4',
  industry_profession: '#ffdb4d',
  case_experience: '#ff7b7b',
}

// ---- Custom Node Component ----
function KnowledgeNode({ data }: { data: { label: string; unitType: KnowledgeType; confidence: number; seciStage?: SECIStage } }) {
  const color = NODE_COLORS[data.unitType]

  return (
    <div
      className="px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-shadow duration-150 hover:shadow-[0_0_16px_rgba(0,0,0,0.5),0_0_4px_rgba(123,150,255,0.15)]"
      style={{
        background: 'rgba(14,14,26,0.97)',
        borderColor: `${color}35`,
        color: color,
        minWidth: 130,
        maxWidth: 190,
        backdropFilter: 'blur(8px)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`${data.label} — ${KNOWLEDGE_TYPE_LABELS[data.unitType]}`}
    >
      <Handle type="target" position={Position.Top} style={{ background: color, width: 8, height: 8 }} />
      <div className="truncate font-semibold text-[color:var(--color-text-primary)]">{data.label}</div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className="text-[10px] opacity-70">{KNOWLEDGE_TYPE_LABELS[data.unitType]}</span>
        {data.seciStage && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${color}12` }}>
            SECI
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { knowledgeNode: KnowledgeNode }

// ---- Filter Button Component ----
function FilterButton({ active, onClick, label, ariaLabel }: { active: boolean; onClick: () => void; label: string; ariaLabel?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-pressed={active}
      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 min-h-[36px] ${
        active
          ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)] ring-1 ring-[rgba(123,150,255,0.2)]'
          : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)] hover:text-[color:var(--color-text-primary)] active:scale-[0.98]'
      }`}
    >
      {label}
    </button>
  )
}

// ---- Main Page ----
export default function GraphPage() {
  const [selectedUnit, setSelectedUnit] = useState<KnowledgeUnit | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  // Filter state
  const [filterType, setFilterType] = useState<KnowledgeType | 'all'>('all')
  const [filterRelation, setFilterRelation] = useState<RelationType | 'all'>('all')
  const [filterSECI, setFilterSECI] = useState<SECIStage | 'all'>('all')

  // Filtered data
  const filteredUnits = useMemo(() => {
    let units = mockKnowledgeUnits.filter((u) => u.status === 'approved')
    if (filterType !== 'all') units = units.filter((u) => u.type === filterType)
    if (filterSECI !== 'all') units = units.filter((u) => u.seciStage === filterSECI)
    return units
  }, [filterType, filterSECI])

  const filteredUnitIds = useMemo(() => new Set(filteredUnits.map((u) => u.id)), [filteredUnits])

  const filteredRelations = useMemo(() => {
    let rels = mockRelations.filter((r) => r.status === 'approved')
    if (filterRelation !== 'all') rels = rels.filter((r) => r.relationType === filterRelation)
    rels = rels.filter(
      (r) => filteredUnitIds.has(r.sourceUnitId) && filteredUnitIds.has(r.targetUnitId)
    )
    return rels
  }, [filterRelation, filteredUnitIds])

  // React Flow nodes & edges
  const positionMap = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(filteredUnits.length))
    const map: Record<string, { x: number; y: number }> = {}
    filteredUnits.forEach((u, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      map[u.id] = { x: col * 230 + 50, y: row * 150 + 50 }
    })
    return map
  }, [filteredUnits])

  const initialNodes = useMemo<Node[]>(
    () =>
      filteredUnits.map((u) => ({
        id: u.id,
        type: 'knowledgeNode',
        position: positionMap[u.id] || { x: 0, y: 0 },
        data: { label: u.name, unitType: u.type, confidence: u.confidence, seciStage: u.seciStage },
      })),
    [filteredUnits, positionMap]
  )

  const initialEdges = useMemo<Edge[]>(
    () =>
      filteredRelations.map((r, i) => ({
        id: r.id,
        source: r.sourceUnitId,
        target: r.targetUnitId,
        label: RELATION_TYPE_LABELS[r.relationType],
        labelStyle: { fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: 'var(--color-surface)', fillOpacity: 0.9 },
        style: { stroke: 'var(--color-text-muted)', strokeWidth: 1.5, strokeOpacity: 0.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-text-muted)', width: 16, height: 16 },
      })),
    [filteredRelations]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Sync React Flow state when filters change
  useMemo(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const unit = mockKnowledgeUnits.find((u) => u.id === node.id)
      if (unit) setSelectedUnit(unit)
    },
    []
  )

  // Related units for detail panel
  const relatedUnits = useMemo(() => {
    if (!selectedUnit) return []
    const relIds = mockRelations
      .filter(
        (r) =>
          (r.sourceUnitId === selectedUnit.id || r.targetUnitId === selectedUnit.id) &&
          r.status === 'approved'
      )
      .map((r) => (r.sourceUnitId === selectedUnit.id ? r.targetUnitId : r.sourceUnitId))
    return mockKnowledgeUnits.filter((u) => relIds.includes(u.id))
  }, [selectedUnit])

  const selectedRelations = useMemo(() => {
    if (!selectedUnit) return []
    return mockRelations.filter(
      (r) =>
        (r.sourceUnitId === selectedUnit.id || r.targetUnitId === selectedUnit.id) &&
        r.status === 'approved'
    )
  }, [selectedUnit])

  return (
    <div className="flex h-full">
      {/* Left Filter Panel */}
      {showFilters && (
        <aside
          className="w-56 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 space-y-4 overflow-auto"
          role="complementary"
          aria-label="图谱筛选器"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" /> 筛选器
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1.5 rounded-lg text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-raised)] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="关闭筛选器"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Knowledge Type Filter */}
          <fieldset>
            <legend className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider mb-1.5">知识类型</legend>
            <div className="space-y-0.5">
              {[
                { value: 'all', label: '全部' },
                { value: 'concept', label: '概念' },
                { value: 'methodology', label: '方法论' },
                { value: 'industry_profession', label: '行业/职业' },
                { value: 'case_experience', label: '案例/经验' },
              ].map((opt) => (
                <FilterButton
                  key={opt.value}
                  active={filterType === opt.value}
                  onClick={() => setFilterType(opt.value as KnowledgeType | 'all')}
                  label={opt.label}
                />
              ))}
            </div>
          </fieldset>

          {/* Relation Type Filter */}
          <fieldset>
            <legend className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider mb-1.5">关系类型</legend>
            <div className="space-y-0.5 max-h-40 overflow-auto">
              <FilterButton
                active={filterRelation === 'all'}
                onClick={() => setFilterRelation('all')}
                label="全部"
              />
              {(Object.entries(RELATION_TYPE_LABELS) as [RelationType, string][]).map(([key, label]) => (
                <FilterButton
                  key={key}
                  active={filterRelation === key}
                  onClick={() => setFilterRelation(key)}
                  label={label}
                />
              ))}
            </div>
          </fieldset>

          {/* SECI Stage Filter */}
          <fieldset>
            <legend className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider mb-1.5">SECI 状态</legend>
            <div className="space-y-0.5">
              <FilterButton
                active={filterSECI === 'all'}
                onClick={() => setFilterSECI('all')}
                label="全部"
              />
              {(Object.entries(SECI_STAGE_LABELS) as [SECIStage, string][]).map(([key, label]) => (
                <FilterButton
                  key={key}
                  active={filterSECI === key}
                  onClick={() => setFilterSECI(key)}
                  label={label}
                />
              ))}
            </div>
          </fieldset>

          <div className="text-[10px] text-[color:var(--color-text-muted)] pt-2 border-t border-[color:var(--color-border)] tabular-nums">
            {filteredUnits.length} 节点 · {filteredRelations.length} 关系
          </div>
        </aside>
      )}

      {/* Graph Canvas */}
      <div className="flex-1 relative" role="application" aria-label="知识图谱画布">
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-xs text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:border-[color:var(--color-border-hover)] transition-all min-h-[40px]"
            aria-label="打开筛选器"
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" /> 筛选器
          </button>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          attributionPosition="bottom-left"
          style={{ background: 'var(--color-background)' }}
        >
          <Background color="var(--color-border)" gap={24} size={1} />
          <Controls
            className="[&>button]:min-w-[32px] [&>button]:min-h-[32px]"
            aria-label="画布控制"
          />
          <MiniMap
            style={{ background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            maskColor="rgba(0,0,0,0.5)"
            nodeColor={(n) => {
              const type = (n.data?.unitType as KnowledgeType) || 'concept'
              return NODE_COLORS[type]
            }}
            aria-label="图谱缩略图"
          />
        </ReactFlow>
      </div>

      {/* Right Detail Panel */}
      {selectedUnit && (
        <aside
          className="w-80 shrink-0 border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-auto animate-in"
          role="complementary"
          aria-label={`知识详情: ${selectedUnit.name}`}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-[var(--z-header)] bg-[color:var(--color-surface)]/95 backdrop-blur-sm border-b border-[color:var(--color-border)] p-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">知识详情</h3>
            <button
              onClick={() => setSelectedUnit(null)}
              className="p-1.5 rounded-lg text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-raised)] transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="关闭详情面板"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Name & Type */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge-${selectedUnit.type} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                  {KNOWLEDGE_TYPE_LABELS[selectedUnit.type]}
                </span>
                {selectedUnit.seciStage && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-muted)]">
                    {SECI_STAGE_LABELS[selectedUnit.seciStage]}
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold">{selectedUnit.name}</h2>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider font-medium">描述</label>
              <p className="text-sm text-[color:var(--color-text-secondary)] mt-1.5 leading-relaxed">
                {selectedUnit.description}
              </p>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider font-medium">关键词</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {selectedUnit.keywords.map((kw) => (
                  <span key={kw} className="text-[11px] px-2 py-1 rounded-lg bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)]">
                <div className="text-[10px] text-[color:var(--color-text-muted)] mb-0.5">可信度</div>
                <div className="text-sm font-bold text-[color:var(--color-accent)] tabular-nums">
                  {(selectedUnit.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)]">
                <div className="text-[10px] text-[color:var(--color-text-muted)] mb-0.5">使用次数</div>
                <div className="text-sm font-bold tabular-nums">{selectedUnit.usageCount}</div>
              </div>
            </div>

            {/* Related Relations */}
            {selectedRelations.length > 0 && (
              <div>
                <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <GitBranch className="w-3 h-3" aria-hidden="true" />
                  关系
                </label>
                <div className="mt-1.5 space-y-0.5">
                  {selectedRelations.map((rel) => {
                    const otherId = rel.sourceUnitId === selectedUnit.id ? rel.targetUnitId : rel.sourceUnitId
                    const otherUnit = mockKnowledgeUnits.find((u) => u.id === otherId)
                    return (
                      <div key={rel.id} className="flex items-center gap-1.5 text-xs py-1.5 px-2 rounded-lg hover:bg-[color:var(--color-surface-raised)] transition-colors">
                        <ChevronRight className="w-3 h-3 text-[color:var(--color-text-muted)] shrink-0" aria-hidden="true" />
                        <span className="text-[color:var(--color-text-muted)] shrink-0">{RELATION_TYPE_LABELS[rel.relationType]}</span>
                        <button
                          onClick={() => {
                            const unit = mockKnowledgeUnits.find((u) => u.id === otherId)
                            if (unit) setSelectedUnit(unit)
                          }}
                          className="text-[color:var(--color-text-primary)] hover:text-[color:var(--color-accent)] transition-colors truncate font-medium"
                          aria-label={`查看 ${otherUnit?.name || otherId}`}
                        >
                          {otherUnit?.name || otherId}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Related Knowledge Units */}
            {relatedUnits.length > 0 && (
              <div>
                <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider font-medium">相关节点</label>
                <div className="mt-1.5 space-y-1">
                  {relatedUnits.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs hover:bg-[color:var(--color-surface-raised)] active:scale-[0.98] transition-all text-left min-h-[40px]"
                      aria-label={`查看 ${unit.name}`}
                    >
                      <span className={`badge-${unit.type} text-[10px] px-1.5 py-0.5 rounded shrink-0`}>
                        {KNOWLEDGE_TYPE_LABELS[unit.type]}
                      </span>
                      <span className="truncate">{unit.name}</span>
                      <ExternalLink className="w-3 h-3 text-[color:var(--color-text-muted)] ml-auto shrink-0" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-[color:var(--color-border)]">
              <button className="btn btn-primary flex-1 text-xs" aria-label="基于此知识发起对话">
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                发起对话
              </button>
              <button className="btn btn-secondary flex-1 text-xs" aria-label="继续探索相关节点">
                继续探索
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
