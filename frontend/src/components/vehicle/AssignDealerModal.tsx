import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { useDealers } from '../../services/dealerService'
import { useAssignDealer } from '../../services/vehicleService'
import { toast } from 'sonner'
import type { VehicleResponse } from '../../types'
import { Building2, Unlink } from 'lucide-react'
import { buildDealerSelectOptions } from '../../utils/vehicleMetrics'

interface AssignDealerModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle?: VehicleResponse | null
}

export function AssignDealerModal({ isOpen, onClose, vehicle }: AssignDealerModalProps) {
  const [selectedDealerId, setSelectedDealerId] = useState<string>('')
  const { data: dealers, isLoading: isLoadingDealers } = useDealers()
  const assignDealer = useAssignDealer()

  if (!vehicle) return null

  const handleSave = async () => {
    try {
      const dealerId = selectedDealerId ? Number(selectedDealerId) : null
      await assignDealer.mutateAsync({
        id: vehicle.id,
        data: { dealerId },
      })
      if (dealerId === null) {
        toast.success(`Veículo ${vehicle.brand} ${vehicle.model} desvinculado com sucesso!`)
      } else {
        const dealerName = dealers?.find((d) => d.id === dealerId)?.corporateName
        toast.success(`Veículo vinculado a ${dealerName}!`)
      }
      onClose()
    } catch {
      toast.error('Erro ao atualizar vínculo do veículo.')
    }
  }

  const dealerOptions = buildDealerSelectOptions(dealers, 'Sem concessionária (Estoque Central)')

  const currentSelectedValue = selectedDealerId !== '' ? selectedDealerId : (vehicle.dealer ? String(vehicle.dealer.id) : '')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vincular Concessionária"
      description={`Altere a concessionária responsável pelo veículo ${vehicle.brand} ${vehicle.model}.`}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 block mb-0.5">Veículo</span>
            <span className="font-semibold text-slate-800 text-sm">
              {vehicle.brand} {vehicle.model}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block mb-0.5">Status atual</span>
            {vehicle.dealer ? (
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {vehicle.dealer.corporateName}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                <Unlink className="w-3.5 h-3.5" />
                Não atribuído
              </span>
            )}
          </div>
        </div>

        <Select
          label="Concessionária Destino"
          value={currentSelectedValue}
          onChange={(e) => setSelectedDealerId(e.target.value)}
          options={dealerOptions}
          disabled={isLoadingDealers}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} isLoading={assignDealer.isPending}>
            Salvar Vínculo
          </Button>
        </div>
      </div>
    </Modal>
  )
}
