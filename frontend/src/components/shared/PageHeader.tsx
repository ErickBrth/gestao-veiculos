import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  breadcrumb?: string
  action?: ReactNode
}

export function PageHeader({ title, description, breadcrumb = 'Visão Geral', action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
      <div>
        <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
          <span>Sistema Comercial</span>
          <span>/</span>
          <span className="text-slate-700">{breadcrumb}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  )
}
