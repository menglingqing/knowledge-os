'use client'

import { Settings, User, Folder, Database, Cpu, Bell } from 'lucide-react'

const settingSections = [
  {
    icon: User,
    title: '用户偏好',
    items: [
      { label: '界面语言', value: '简体中文' },
      { label: '默认工作空间', value: '个人空间' },
      { label: '知识卡片默认导出格式', value: 'Markdown (Obsidian)' },
    ],
  },
  {
    icon: Folder,
    title: '工作空间',
    items: [
      { label: '当前工作空间', value: '个人空间' },
      { label: '知识单元数量', value: '12' },
      { label: '文档数量', value: '8' },
    ],
  },
  {
    icon: Database,
    title: '数据源',
    items: [
      { label: 'Obsidian Vault 路径', value: '未连接' },
      { label: '外部数据库', value: '未连接' },
    ],
  },
  {
    icon: Cpu,
    title: '模型配置',
    items: [
      { label: 'LLM Provider', value: 'Anthropic Claude' },
      { label: 'Embedding Model', value: 'text-embedding-3-small' },
      { label: '抽取模型', value: '默认' },
    ],
  },
  {
    icon: Bell,
    title: '通知',
    items: [
      { label: '审核提醒', value: '开启' },
      { label: '知识更新通知', value: '开启' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 animate-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">系统设置</h1>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          管理应用配置和偏好
        </p>
      </div>

      <div className="space-y-3">
        {settingSections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Icon className="w-4 h-4 text-[color:var(--color-text-muted)]" />
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[color:var(--color-surface-raised)]">
                    <span className="text-sm text-[color:var(--color-text-secondary)]">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-[color:var(--color-text-muted)]">
          灵枢 Knowledge OS v0.1.0 MVP · Built with Next.js · 代码托管于 GitHub
        </p>
      </div>
    </div>
  )
}
