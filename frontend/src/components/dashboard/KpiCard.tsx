import type { ReactNode } from 'react'
import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'

interface KpiCardProps {
  title: string
  value: string | number
  subtext?: string
  icon: ReactNode
  isLoading: boolean
}

export function KpiCard({
  title,
  value,
  subtext,
  icon,
  isLoading,
}: KpiCardProps) {
  return (
    <Card className="flex flex-col justify-between p-4 bg-white border border-slate-200/80 shadow-2xs min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </span>
        <div className="w-7 h-7 shrink-0 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
      </div>
      <div className="mt-2.5 min-w-0">
        {isLoading ? (
          <Skeleton className="h-6 w-24 bg-slate-200" />
        ) : (
          <p className="text-xl font-semibold leading-tight text-slate-900 font-mono break-all">
            {value}
          </p>
        )}
        {subtext && (
          <p className="text-[11px] text-slate-400 mt-1 font-sans truncate">{subtext}</p>
        )}
      </div>
    </Card>
  )
}
