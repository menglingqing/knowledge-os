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
} from 'lucide-react'
import { mockKnowledgeUnits, mockRelations } from '@/lib/mock-data'
import {
  KNOWLEDGE_TYPE_LABELS,
  RELATION_TYPE_LABELS,
  SECI_STAGE_LABELS,
} from '@/lib/types'
import type { KnowledgeUnit, KnowledgeType, RelationType, SECIStage } from '@/lib/types'

// ---- Custom Node Component ----
function KnowledgeNode({ data }: { data: { label: string; unitType: KnowledgeType; confidence: number; seciStage?: SECIStage } }) {
  const colors: Record<KnowledgeType, string> = {
    concept: '#6c8cff',
    methodology: '#4ecdc4',
    industry_profession: '#ffd93d',
    case_experience: '#ff6b6b',
  }
  const color = colors[data.unitType]

  return (
    <div
      className="px-3 py-2 rounded-lg border text-xs font-medium shadow-lg"
      style={{
        background: 'rgba(16,16,26,0.95)',
        borderColor: `${color}40`,
        color: color,
        minWidth: 120,
        maxWidth: 180,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color }} />
      <div className="truncate">{data.label}</div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-[10px] opacity-60">{KNOWLEDGE_TYPE_LABELS[data.unitType]}</span>
        {data.seciStage && (
          <span className="text-[10px] px-1 py-0.5 rounded" style={{ background: `${color}15` }}>
            SECI
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color }} />
    </div>
  )
}

const nodeTypes = { knowledgeNode: KnowledgeNode }

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
      map[u.id] = { x: col * 220 + 60, y: row * 140 + 60 }
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
      filteredRelations.map((r) => ({
        id: r.id,
        source: r.sourceUnitId,
        target: r.targetUnitId,
        label: RELATION_TYPE_LABELS[r.relationType],
        style: {
          stroke: 'var(--color-text-muted)',
          strokeWidth: 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--color-text-muted)',
        },
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
        <div className="w-56 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 space-y-4 overflow-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> 筛选器
            </h3>
            <button onClick={() => setShowFilters(false)} className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Knowledge Type Filter */}
          <div>
            <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">知识类型</label>
            <div className="mt-1.5 space-y-0.5">
              {[
                { value: 'all', label: '全部' },
                { value: 'concept', label: '概念' },
                { value: 'methodology', label: '方法论' },
                { value: 'industry_profession', label: '行业/职业' },
                { value: 'case_experience', label: '案例/经验' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value as KnowledgeType | 'all')}
                  className={`w-full text-left px-2 py-1 rounded text-xs ${
                    filterType === opt.value
                      ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                      : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Relation Type Filter */}
          <div>
            <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">关系类型</label>
            <div className="mt-1.5 space-y-0.5 max-h-36 overflow-auto">
              <button
                onClick={() => setFilterRelation('all')}
                className={`w-full text-left px-2 py-1 rounded text-xs ${
                  filterRelation === 'all'
                    ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                    : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)]'
                }`}
              >
                全部
              </button>
              {(Object.entries(RELATION_TYPE_LABELS) as [RelationType, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilterRelation(key)}
                  className={`w-full text-left px-2 py-1 rounded text-xs ${
                    filterRelation === key
                      ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                      : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SECI Stage Filter */}
          <div>
            <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">SECI 状态</label>
            <div className="mt-1.5 space-y-0.5">
              <button
                onClick={() => setFilterSECI('all')}
                className={`w-full text-left px-2 py-1 rounded text-xs ${
                  filterSECI === 'all'
                    ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                    : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)]'
                }`}
              >
                全部
              </button>
              {(Object.entries(SECI_STAGE_LABELS) as [SECIStage, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilterSECI(key)}
                  className={`w-full text-left px-2 py-1 rounded text-xs ${
                    filterSECI === key
                      ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                      : 'text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-raised)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-[color:var(--color-text-muted)] pt-2 border-t border-[color:var(--color-border)]">
            {filteredUnits.length} 节点 · {filteredRelations.length} 关系
          </div>
        </div>
      )}

      {/* Graph Canvas */}
      <div className="flex-1 relative">
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-xs text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
          >
            <Filter className="w-3.5 h-3.5" /> 筛选器
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
          attributionPosition="bottom-left"
          style={{ background: 'var(--color-background)' }}
        >
          <Background color="var(--color-border)" gap={20} />
          <Controls />
          <MiniMap
            style={{ background: 'var(--color-surface)' }}
            maskColor="rgba(0,0,0,0.4)"
            nodeColor={(n) => {
              const type = (n.data?.unitType as KnowledgeType) || 'concept'
              const colors: Record<KnowledgeType, string> = {
                concept: '#6c8cff',
                methodology: '#4ecdc4',
                industry_profession: '#ffd93d',
                case_experience: '#ff6b6b',
              }
              return colors[type]
            }}
          />
        </ReactFlow>
      </div>

      {/* Right Detail Panel */}
      {selectedUnit && (
        <div className="w-80 shrink-0 border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-auto animate-in">
          <div className="sticky top-0 bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] p-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">知识详情</h3>
            <button onClick={() => setSelectedUnit(null)} className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Name & Type */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge-${selectedUnit.type} text-[10px] px-1.5 py-0.5 rounded font-medium`}>
                  {KNOWLEDGE_TYPE_LABELS[selectedUnit.type]}
                </span>
                {selectedUnit.seciStage && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-muted)]">
                    {SECI_STAGE_LABELS[selectedUnit.seciStage]}
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold">{selectedUnit.name}</h2>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">描述</label>
              <p className="text-sm text-[color:var(--color-text-secondary)] mt-1 leading-relaxed">
                {selectedUnit.description}
              </p>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">关键词</label>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedUnit.keywords.map((kw) => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-[color:var(--color-surface-raised)]">
                <div className="text-[10px] text-[color:var(--color-text-muted)]">可信度</div>
                <div className="text-sm font-semibold text-[color:var(--color-accent)]">
                  {(selectedUnit.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[color:var(--color-surface-raised)]">
                <div className="text-[10px] text-[color:var(--color-text-muted)]">使用次数</div>
                <div className="text-sm font-semibold">{selectedUnit.usageCount}</div>
              </div>
            </div>

            {/* Related Relations */}
            {selectedRelations.length > 0 && (
              <div>
                <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">关系</label>
                <div className="mt-1.5 space-y-1">
                  {selectedRelations.map((rel) => {
                    const otherId = rel.sourceUnitId === selectedUnit.id ? rel.targetUnitId : rel.sourceUnitId
                    const otherUnit = mockKnowledgeUnits.find((u) => u.id === otherId)
                    return (
                      <div key={rel.id} className="flex items-center gap-1.5 text-xs py-1">
                        <ChevronRight className="w-3 h-3 text-[color:var(--color-text-muted)]" />
                        <span className="text-[color:var(--color-text-muted)]">{RELATION_TYPE_LABELS[rel.relationType]}</span>
                        <button
                          onClick={() => {
                            const unit = mockKnowledgeUnits.find((u) => u.id === otherId)
                            if (unit) setSelectedUnit(unit)
                          }}
                          className="text-[color:var(--color-text-primary)] hover:text-[color:var(--color-accent)]"
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
                <label className="text-[10px] text-[color:var(--color-text-muted)] uppercase tracking-wider">相关节点</label>
                <div className="mt-1.5 space-y-1">
                  {relatedUnits.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-[color:var(--color-surface-raised)] text-left"
                    >
                      <span className={`badge-${unit.type} text-[10px] px-1 py-0.5 rounded`}>
                        {KNOWLEDGE_TYPE_LABELS[unit.type]}
                      </span>
                      <span>{unit.name}</span>
                      <ExternalLink className="w-3 h-3 text-[color:var(--color-text-muted)] ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-[color:var(--color-border)]">
              <button className="flex-1 py-1.5 rounded-lg bg-[color:var(--color-accent)] text-white text-xs font-medium">
                发起对话
              </button>
              <button className="flex-1 py-1.5 rounded-lg border border-[color:var(--color-border)] text-xs">
                继续探索
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
