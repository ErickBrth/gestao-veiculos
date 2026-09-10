import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors ${className}`}
    >
      {children}
    </div>
  )
}
