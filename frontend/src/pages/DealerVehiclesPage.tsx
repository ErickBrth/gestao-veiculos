import { useParams, Link } from 'react-router-dom'
import { useDealer, useDealerVehicles } from '../services/dealerService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FuelBadge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/shared/EmptyState'
import { formatCurrency } from '../utils/format'
import { ArrowLeft, Building2, Car } from 'lucide-react'

export function DealerVehiclesPage() {
  const { id } = useParams<{ id: string }>()
  const dealerId = Number(id)

  const { data: dealer, isLoading: isLoadingDealer } = useDealer(dealerId)
  const { data: vehicles, isLoading: isLoadingVehicles } = useDealerVehicles(dealerId)

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/dealers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Concessionárias
        </Link>

        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              {isLoadingDealer ? (
                <Skeleton className="h-6 w-48 bg-slate-200" />
              ) : (
                <h2 className="text-xl font-semibold text-slate-900">{dealer?.corporateName}</h2>
              )}
              <span className="text-xs text-slate-500">
                Veículos em estoque nesta concessionária
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLoadingVehicles ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full bg-slate-200" />
          <Skeleton className="h-16 w-full bg-slate-200" />
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="space-y-3 p-4 bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {vehicle.color} {vehicle.manufactureYear ? `• ${vehicle.manufactureYear}` : ''}
                  </p>
                </div>
                <FuelBadge fuelType={vehicle.fuelType} />
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">
                  {vehicle.chassis ? `CH: ${vehicle.chassis}` : 'Sem chassi'}
                </span>
                <span className="font-semibold font-mono text-slate-900">
                  {formatCurrency(vehicle.price)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Car className="w-6 h-6" />}
          title="Nenhum veículo vinculado a esta concessionária"
          description="Acesse o catálogo de veículos para vincular unidades a esta concessionária."
          action={
            <Link to="/vehicles">
              <Button variant="outline" size="sm">
                Ir para Catálogo
              </Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
