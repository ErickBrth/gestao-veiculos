import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import type { ButtonProps } from './types'

export type { ButtonProps }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

    const variants = {
      primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus:ring-slate-950',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500',
      outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-400 bg-white',
      ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
    }

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
