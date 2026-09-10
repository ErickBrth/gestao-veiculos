import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge, FuelBadge } from '../ui/Badge'
import { formatCurrency } from '../../utils/format'
import type { VehicleResponse } from '../../types'
import { Edit2, Trash2, Link2, Building2, AlertCircle } from 'lucide-react'

interface VehicleCardProps {
  vehicle: VehicleResponse
  onEdit: (vehicle: VehicleResponse) => void
  onDelete: (vehicle: VehicleResponse) => void
  onAssign: (vehicle: VehicleResponse) => void
}

export function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onAssign,
}: VehicleCardProps) {
  return (
    <Card className="flex flex-col justify-between p-4 bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 leading-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {vehicle.color}{' '}
              {vehicle.externalColor ? `(${vehicle.externalColor})` : ''}{' '}
              {vehicle.manufactureYear ? `• ${vehicle.manufactureYear}` : ''}
            </p>
          </div>
          <FuelBadge fuelType={vehicle.fuelType} />
        </div>

        <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px]">Chassi</span>
            <span className="font-mono text-slate-700 text-[11px]">
              {vehicle.chassis || '—'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px]">Preço Sugerido</span>
            <span className="font-semibold font-mono text-slate-900">
              {formatCurrency(vehicle.price)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 gap-2 min-w-0">
            <span className="text-slate-500 text-[11px] shrink-0">Concessionária</span>
            {vehicle.dealer ? (
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium min-w-0 text-xs">
                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{vehicle.dealer.corporateName}</span>
              </span>
            ) : (
              <Badge variant="warning" className="gap-1 text-[11px] shrink-0">
                <AlertCircle className="w-3 h-3" />
                Sem vínculo
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssign(vehicle)}
          className="text-xs"
        >
          <Link2 className="w-3.5 h-3.5 text-slate-500" />
          {vehicle.dealer ? 'Alterar vínculo' : 'Vincular'}
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(vehicle)}
            title="Editar"
            aria-label={`Editar ${vehicle.brand} ${vehicle.model}`}
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(vehicle)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Excluir"
            aria-label={`Excluir ${vehicle.brand} ${vehicle.model}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
