import { useState } from 'react'
import { useDealers } from '../services/dealerService'
import { useVehicles } from '../services/vehicleService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, FuelBadge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { DealerFormModal } from '../components/dealer/DealerFormModal'
import { VehicleFormModal } from '../components/vehicle/VehicleFormModal'
import { Building2, Car, Plus, AlertCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { data: dealers, isLoading: isLoadingDealers } = useDealers()
  const { data: vehicles, isLoading: isLoadingVehicles } = useVehicles()

  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)

  const totalDealers = dealers?.length || 0
  const totalVehicles = vehicles?.length || 0
  const unassignedVehicles = vehicles?.filter((v) => !v.dealer) || []
  const totalValue =
    vehicles?.reduce((sum, v) => sum + (v.price ? Number(v.price) : 0), 0) || 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            Painel da Montadora
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Visão consolidada da rede comercial de concessionárias e catálogo de veículos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setIsDealerModalOpen(true)}>
            <Building2 className="w-4 h-4 mr-1.5 text-indigo-400" />
            Nova Concessionária
          </Button>
          <Button variant="primary" onClick={() => setIsVehicleModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Novo Veículo
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Concessionárias
            </span>
            {isLoadingDealers ? (
              <Skeleton className="h-7 w-14 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-slate-100 mt-0.5">{totalDealers}</p>
            )}
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Frota Total
            </span>
            {isLoadingVehicles ? (
              <Skeleton className="h-7 w-14 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-slate-100 mt-0.5">{totalVehicles}</p>
            )}
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sem Concessionária
            </span>
            {isLoadingVehicles ? (
              <Skeleton className="h-7 w-14 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-amber-400 mt-0.5">
                {unassignedVehicles.length}
              </p>
            )}
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Valor do Catálogo
            </span>
            {isLoadingVehicles ? (
              <Skeleton className="h-7 w-20 mt-1" />
            ) : (
              <p className="text-lg font-bold text-slate-100 mt-0.5 truncate">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  totalValue
                )}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Vehicles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-100">
              Últimos Veículos do Catálogo
            </h3>
            <Link to="/vehicles" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Ver todos →
            </Link>
          </div>

          <Card className="p-0 overflow-hidden">
            {isLoadingVehicles ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : vehicles && vehicles.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100">
                            {vehicle.brand} {vehicle.model}
                          </span>
                          <FuelBadge fuelType={vehicle.fuelType} />
                        </div>
                        <span className="text-xs text-slate-400">
                          {vehicle.color} {vehicle.manufactureYear ? `• ${vehicle.manufactureYear}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {vehicle.price && (
                        <p className="text-sm font-semibold text-slate-200">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            Number(vehicle.price)
                          )}
                        </p>
                      )}
                      {vehicle.dealer ? (
                        <span className="text-xs text-indigo-400">{vehicle.dealer.corporateName}</span>
                      ) : (
                        <Badge variant="warning">Estoque Central</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                Nenhum veículo cadastrado.
              </div>
            )}
          </Card>
        </div>

        {/* Dealers Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-100">Rede Autorizada</h3>
            <Link to="/dealers" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Ver todas →
            </Link>
          </div>

          <Card className="p-0 overflow-hidden">
            {isLoadingDealers ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : dealers && dealers.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {dealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm text-slate-100">
                        {dealer.corporateName}
                      </p>
                      <span className="text-xs text-slate-400">
                        {dealer.address.city}/{dealer.address.state} • CNPJ:{' '}
                        {dealer.cnpj.replace(
                          /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                          '$1.$2.$3/$4-$5'
                        )}
                      </span>
                    </div>
                    <Link
                      to={`/dealers/${dealer.id}/vehicles`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
                    >
                      Veículos
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                Nenhuma concessionária cadastrada.
              </div>
            )}
          </Card>
        </div>
      </div>

      <DealerFormModal
        isOpen={isDealerModalOpen}
        onClose={() => setIsDealerModalOpen(false)}
      />
      <VehicleFormModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />
    </div>
  )
}
