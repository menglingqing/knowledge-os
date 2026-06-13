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
    <aside
      className="w-56 shrink-0 h-full flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      role="navigation"
      aria-label="主导航"
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-[color:var(--color-border)]">
        <div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-methodology)] flex items-center justify-center shadow-[0_0_12px_rgba(123,150,255,0.3)]"
          aria-hidden="true"
        >
          <Hexagon className="w-4 h-4 text-white" />
        </div>
        <Link href="/" className="no-underline" aria-label="灵枢 Knowledge OS 首页">
          <span className="text-sm font-semibold tracking-wide text-[color:var(--color-text-primary)]">灵枢</span>
          <span className="text-[10px] text-[color:var(--color-text-muted)] block leading-none mt-0.5">Knowledge OS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-auto" aria-label="页面导航">
        {navigation.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-[color:var(--color-accent-glow)] text-[color:var(--color-accent)]'
                  : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-raised)]'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[color:var(--color-accent)]"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  isActive
                    ? 'text-[color:var(--color-accent)]'
                    : 'text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text-secondary)]'
                }`}
                aria-hidden="true"
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer — User Profile */}
      <div className="p-2.5 border-t border-[color:var(--color-border)]">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[color:var(--color-surface-raised)]">
          <div
            className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-expert)] flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            aria-hidden="true"
          >
            U
          </div>
          <div className="text-xs min-w-0">
            <div className="text-[color:var(--color-text-primary)] font-medium truncate">用户</div>
            <div className="text-[color:var(--color-text-muted)] truncate text-[11px]">个人空间</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
