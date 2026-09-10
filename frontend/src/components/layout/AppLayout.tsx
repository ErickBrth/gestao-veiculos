import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Building2, Car, LayoutDashboard, Menu, X } from 'lucide-react'
import { Toaster } from 'sonner'

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Concessionárias', path: '/dealers', icon: Building2 },
    { label: 'Veículos', path: '/vehicles', icon: Car },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      <Toaster position="top-right" richColors theme="light" closeButton />

      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-base text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            <Car className="w-4 h-4" />
          </div>
          <span>AutoGestão</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 border-r border-slate-200 bg-white flex flex-col z-40 transition-transform duration-200 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 px-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight text-slate-900">AutoGestão B2B</h1>
            <span className="text-[11px] text-slate-500 font-normal">Operações Comerciais</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
