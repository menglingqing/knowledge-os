'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Upload,
  Library,
  GitGraph,
  MessageSquare,
  Sparkles,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  Hexagon,
} from 'lucide-react'

const navigation = [
  { href: '/', label: '工作台', icon: LayoutDashboard },
  { href: '/upload', label: '知识上传', icon: Upload },
  { href: '/library', label: '知识资产库', icon: Library },
  { href: '/graph', label: '知识图谱', icon: GitGraph },
  { href: '/chat', label: '知识对话', icon: MessageSquare },
  { href: '/seci', label: 'SECI 螺旋', icon: Sparkles },
  { href: '/experts', label: '仿真专家', icon: Users },
  { href: '/governance', label: '知识治理', icon: ShieldCheck },
  { href: '/analytics', label: '成长分析', icon: BarChart3 },
  { href: '/settings', label: '系统设置', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 h-full flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[color:var(--color-border)]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-methodology)] flex items-center justify-center">
          <Hexagon className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold tracking-wide">灵枢</span>
          <span className="text-[10px] text-[color:var(--color-text-muted)] block leading-none mt-0.5">Knowledge OS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-auto">
        {navigation.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                  : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-raised)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text-secondary)]'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[color:var(--color-border)]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--color-surface-raised)]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-expert)] flex items-center justify-center text-[10px] font-bold text-white">
            U
          </div>
          <div className="text-xs">
            <div className="text-[color:var(--color-text-primary)] font-medium">用户</div>
            <div className="text-[color:var(--color-text-muted)]">个人空间</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
