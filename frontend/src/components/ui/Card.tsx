import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm p-5 shadow-xl transition-all hover:border-slate-700/80 ${className}`}
    >
      {children}
    </div>
  )
}
