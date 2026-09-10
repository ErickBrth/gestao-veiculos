import { useState } from 'react'
import { useDealers } from '../services/dealerService'
import { useVehicles } from '../services/vehicleService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, FuelBadge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { DealerFormModal } from '../components/dealer/DealerFormModal'
import { VehicleFormModal } from '../components/vehicle/VehicleFormModal'
import { KpiCard } from '../components/dashboard/KpiCard'
import { PageHeader } from '../components/shared/PageHeader'
import { formatCnpj, formatCurrency } from '../utils/format'
import { Building2, Car, Plus, AlertCircle, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { calculateTotalCatalogValue } from '../utils/vehicleMetrics'

export function DashboardPage() {
  const { data: dealers, isLoading: isLoadingDealers } = useDealers()
  const { data: vehicles, isLoading: isLoadingVehicles } = useVehicles()

  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)

  const totalDealers = dealers?.length || 0
  const totalVehicles = vehicles?.length || 0
  const unassignedVehicles = vehicles?.filter((v) => !v.dealer) || []
  const assignedCount = totalVehicles - unassignedVehicles.length
  const totalValue = calculateTotalCatalogValue(vehicles)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel Comercial"
        breadcrumb="Dashboard"
        description="Monitoramento executivo da frota de veículos e da rede de concessionárias autorizadas."
        action={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsDealerModalOpen(true)}
            >
              <Building2 className="w-4 h-4 mr-1.5 text-slate-500" />
              Nova Concessionária
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsVehicleModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Novo Veículo
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Concessionárias"
          value={totalDealers}
          subtext="Pontos de venda ativos na rede"
          icon={<Building2 className="w-4 h-4" />}
          isLoading={isLoadingDealers}
        />
        <KpiCard
          title="Frota Cadastrada"
          value={totalVehicles}
          subtext={`${assignedCount} com vínculo comercial`}
          icon={<Car className="w-4 h-4" />}
          isLoading={isLoadingVehicles}
        />
        <KpiCard
          title="Estoque Central"
          value={unassignedVehicles.length}
          subtext="Veículos aguardando distribuição"
          icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
          isLoading={isLoadingVehicles}
        />
        <KpiCard
          title="Volume do Catálogo"
          value={formatCurrency(totalValue)}
          subtext="Valor agregado em tabela oficial"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          isLoading={isLoadingVehicles}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Últimos Veículos Inseridos
              </h2>
              <p className="text-xs text-slate-500">
                Registro dos modelos mais recentes no sistema central.
              </p>
            </div>
            <Link
              to="/vehicles"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 hover:underline"
            >
              Ver catálogo completo
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border border-slate-200">
            {isLoadingVehicles ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-9 w-full bg-slate-100" />
                <Skeleton className="h-9 w-full bg-slate-100" />
                <Skeleton className="h-9 w-full bg-slate-100" />
              </div>
            ) : vehicles && vehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-medium uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-4 font-semibold">Veículo</th>
                      <th className="py-2.5 px-3 font-semibold">Combustível</th>
                      <th className="py-2.5 px-3 font-semibold">Preço</th>
                      <th className="py-2.5 px-4 font-semibold">Status / Vínculo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehicles.slice(0, 5).map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {vehicle.color} {vehicle.manufactureYear ? `• ${vehicle.manufactureYear}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <FuelBadge fuelType={vehicle.fuelType} />
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-900">
                          {formatCurrency(vehicle.price)}
                        </td>
                        <td className="py-3 px-4">
                          {vehicle.dealer ? (
                            <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[140px]" title={vehicle.dealer.corporateName}>
                                {vehicle.dealer.corporateName}
                              </span>
                            </span>
                          ) : (
                            <Badge variant="warning">Sem vínculo (Central)</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhum veículo cadastrado no momento.
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Rede Autorizada</h2>
              <p className="text-xs text-slate-500">Concessionárias cadastradas</p>
            </div>
            <Link
              to="/dealers"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 hover:underline"
            >
              Gerenciar
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Card className="p-0 overflow-hidden border border-slate-200 divide-y divide-slate-100">
            {isLoadingDealers ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-9 w-full bg-slate-100" />
                <Skeleton className="h-9 w-full bg-slate-100" />
              </div>
            ) : dealers && dealers.length > 0 ? (
              dealers.slice(0, 5).map((dealer) => (
                <div
                  key={dealer.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-xs text-slate-900 truncate">
                      {dealer.corporateName}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {dealer.address.city}/{dealer.address.state} •{' '}
                      <span className="font-mono">{formatCnpj(dealer.cnpj)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/dealers/${dealer.id}/vehicles`}
                    className="shrink-0 text-xs text-slate-700 hover:text-slate-900 font-medium bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Estoque
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma concessionária registrada.
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
