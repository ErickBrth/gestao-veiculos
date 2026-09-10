import type { FuelType } from '../../types'
import { FUEL_BADGE_CONFIG } from './fuelBadgeConfig'
import type { BadgeProps } from './types'

export type { BadgeProps }

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function FuelBadge({ fuelType }: { fuelType: FuelType }) {
  const config = FUEL_BADGE_CONFIG[fuelType] || { label: fuelType, variant: 'default' as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
