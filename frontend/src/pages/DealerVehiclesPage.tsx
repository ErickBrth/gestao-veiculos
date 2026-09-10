import { useParams, Link } from 'react-router-dom'
import { useDealer, useDealerVehicles } from '../services/dealerService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FuelBadge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { ArrowLeft, Building2, Car } from 'lucide-react'

export function DealerVehiclesPage() {
  const { id } = useParams<{ id: string }>()
  const dealerId = Number(id)

  const { data: dealer, isLoading: isLoadingDealer } = useDealer(dealerId)
  const { data: vehicles, isLoading: isLoadingVehicles } = useDealerVehicles(dealerId)

  return (
    <div className="space-y-6">
      {/* Header with back link */}
      <div>
        <Link
          to="/dealers"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para Concessionárias
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              {isLoadingDealer ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <h2 className="text-xl font-bold text-slate-100">{dealer?.corporateName}</h2>
              )}
              <span className="text-xs text-slate-400">
                Veículos em estoque nesta concessionária
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {isLoadingVehicles ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {vehicle.color} {vehicle.manufactureYear ? `• ${vehicle.manufactureYear}` : ''}
                  </p>
                </div>
                <FuelBadge fuelType={vehicle.fuelType} />
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">
                  {vehicle.chassis ? `CH: ${vehicle.chassis}` : 'Sem chassi'}
                </span>
                <span className="font-bold text-slate-200">
                  {vehicle.price
                    ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(Number(vehicle.price))
                    : '-'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-400">
          <Car className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-base text-slate-200">
            Nenhum veículo vinculado a esta concessionária
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Acesse a aba de Veículos para associar unidades a esta filial.
          </p>
          <div className="mt-4">
            <Link to="/vehicles">
              <Button variant="outline" size="sm">
                Ir para Veículos
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
