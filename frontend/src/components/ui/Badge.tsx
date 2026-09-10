import type { ReactNode } from 'react'
import type { FuelType } from '../../types'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function FuelBadge({ fuelType }: { fuelType: FuelType }) {
  const fuelMap: Record<FuelType, { label: string; variant: BadgeProps['variant'] }> = {
    FLEX: { label: 'Flex', variant: 'success' },
    GASOLINA: { label: 'Gasolina', variant: 'warning' },
    ETANOL: { label: 'Etanol', variant: 'info' },
    DIESEL: { label: 'Diesel', variant: 'default' },
    HIBRIDO: { label: 'Híbrido', variant: 'info' },
    ELETRICO: { label: 'Elétrico', variant: 'success' },
    GNV: { label: 'GNV', variant: 'default' },
  }

  const { label, variant } = fuelMap[fuelType] || { label: fuelType, variant: 'default' }

  return <Badge variant={variant}>{label}</Badge>
}
