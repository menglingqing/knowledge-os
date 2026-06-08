// ============================================================
// 灵枢 Knowledge OS — Core Data Types
// ============================================================

// ---- Source Document ----
export type SourceType = 'pdf' | 'web' | 'markdown' | 'text' | 'interview' | 'manual' | 'database'
export type DocumentStatus = 'uploaded' | 'parsed' | 'processed' | 'failed'

export interface SourceDocument {
  id: string
  title: string
  sourceType: SourceType
  fileUrl?: string
  originalText?: string
  author?: string
  uploadedBy: string
  workspaceId: string
  status: DocumentStatus
  createdAt: string
  updatedAt: string
}

// ---- Document Chunk ----
export interface DocumentChunk {
  id: string
  documentId: string
  chunkIndex: number
  content: string
  summary?: string
  embeddingId?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// ---- Knowledge Unit ----
export type KnowledgeType = 'concept' | 'methodology' | 'industry_profession' | 'case_experience'
export type UnitStatus = 'candidate' | 'approved' | 'rejected' | 'archived'
export type SECIStage = 'socialization' | 'externalization' | 'combination' | 'internalization'
export type CreatedBy = 'system' | 'user' | 'agent'

export interface KnowledgeUnit {
  id: string
  name: string
  type: KnowledgeType
  description: string
  summary?: string
  keywords: string[]
  tags: string[]
  confidence: number
  status: UnitStatus
  seciStage?: SECIStage
  sourceDocumentIds: string[]
  sourceChunkIds: string[]
  createdBy: CreatedBy
  reviewedBy?: string
  workspaceId: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

// ---- Knowledge Relation ----
export type RelationType =
  | 'supports'
  | 'complements'
  | 'contradicts'
  | 'relates_to'
  | 'extracted_from'
  | 'externalized_to'
  | 'combined_into'
  | 'applied_in'
  | 'validated_by'
  | 'internalized_by'

export interface KnowledgeRelation {
  id: string
  sourceUnitId: string
  targetUnitId: string
  relationType: RelationType
  description?: string
  evidenceChunkIds: string[]
  confidence: number
  status: 'candidate' | 'approved' | 'rejected'
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
}

// ---- Expert ----
export type ExpertStatus = 'draft' | 'active' | 'archived'

export interface Expert {
  id: string
  name: string
  title?: string
  domain: string[]
  description: string
  avatarUrl?: string
  sourceDocumentIds: string[]
  styleProfile?: string
  knowledgeUnitIds: string[]
  status: ExpertStatus
  workspaceId: string
  createdAt: string
  updatedAt: string
}

// ---- Conversation & Message ----
export type ConversationMode = 'normal' | 'expert' | 'multi_expert' | 'topic' | 'case'

export interface Citation {
  sourceDocumentId: string
  chunkId: string
  text: string
}

export interface Conversation {
  id: string
  title: string
  mode: ConversationMode
  expertIds?: string[]
  workspaceId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'expert' | 'system'
  content: string
  citations?: Citation[]
  relatedKnowledgeUnitIds?: string[]
  createdAt: string
}

// ---- Feedback ----
export type FeedbackTargetType = 'knowledge_unit' | 'relation' | 'answer' | 'expert'
export type FeedbackType = 'like' | 'dislike' | 'correction' | 'useful' | 'not_useful'

export interface Feedback {
  id: string
  userId: string
  targetType: FeedbackTargetType
  targetId: string
  feedbackType: FeedbackType
  comment?: string
  createdAt: string
}

// ---- Relational Display Helpers ----
export const KNOWLEDGE_TYPE_LABELS: Record<KnowledgeType, string> = {
  concept: '概念',
  methodology: '方法论',
  industry_profession: '行业/职业',
  case_experience: '案例/经验',
}

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  supports: '支持',
  complements: '补充',
  contradicts: '冲突/反驳',
  relates_to: '主题关联',
  extracted_from: '来源于',
  externalized_to: '外化为',
  combined_into: '组合成',
  applied_in: '应用于',
  validated_by: '被验证',
  internalized_by: '被内化',
}

export const SECI_STAGE_LABELS: Record<SECIStage, string> = {
  socialization: 'Socialization 社会化',
  externalization: 'Externalization 外化',
  combination: 'Combination 组合化',
  internalization: 'Internalization 内化',
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  uploaded: '已上传',
  parsed: '已解析',
  processed: '已处理',
  failed: '失败',
}

// ---- Graph Node/Edge types for React Flow ----
export interface GraphNodeData {
  label: string
  unitType: KnowledgeType
  confidence: number
  seciStage?: SECIStage
  status: UnitStatus
}
