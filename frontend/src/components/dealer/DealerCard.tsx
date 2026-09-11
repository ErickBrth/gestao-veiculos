import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import type { DealerResponse } from '../../types'
import { Edit2, Trash2, Car, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { maskCnpj, maskZipCode } from '../../utils/format'

interface DealerCardProps {
  dealer: DealerResponse
  onEdit: (dealer: DealerResponse) => void
  onDelete: (dealer: DealerResponse) => void
}

export function DealerCard({ dealer, onEdit, onDelete }: DealerCardProps) {
  return (
    <Card className="flex flex-col justify-between p-4 bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 leading-tight">
              {dealer.corporateName}
            </h3>
            <span className="text-xs font-mono text-slate-500 mt-0.5 block">
              CNPJ: {maskCnpj(dealer.cnpj)}
            </span>
          </div>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono border border-slate-200/60">
            #{dealer.id}
          </span>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed text-[11px]">
            {dealer.address.street}, {dealer.address.number}
            {dealer.address.complement ? ` - ${dealer.address.complement}` : ''}
            <br />
            {dealer.address.neighborhood}, {dealer.address.city} - {dealer.address.state} • CEP:{' '}
            <span className="font-mono">{maskZipCode(dealer.address.zipCode)}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
        <Link
          to={`/dealers/${dealer.id}/vehicles`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md border border-slate-200 transition-colors"
        >
          <Car className="w-3.5 h-3.5 text-slate-500" />
          Ver Estoque
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(dealer)}
            title="Editar"
            aria-label={`Editar ${dealer.corporateName}`}
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(dealer)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Excluir"
            aria-label={`Excluir ${dealer.corporateName}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
