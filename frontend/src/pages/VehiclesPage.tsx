import { useState, useMemo } from 'react'
import { useVehicles, useDeleteVehicle } from '../services/vehicleService'
import { useDealers } from '../services/dealerService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Skeleton } from '../components/ui/Skeleton'
import { VehicleCard } from '../components/vehicle/VehicleCard'
import { PageHeader } from '../components/shared/PageHeader'
import { EmptyState } from '../components/shared/EmptyState'
import { VehicleFormModal } from '../components/vehicle/VehicleFormModal'
import { AssignDealerModal } from '../components/vehicle/AssignDealerModal'
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal'
import type { VehicleResponse } from '../types'
import { Car, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

export function VehiclesPage() {
  const [selectedDealerFilter, setSelectedDealerFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: dealers } = useDealers()

  const filterParams = useMemo(() => {
    if (selectedDealerFilter === 'UNASSIGNED') {
      return { unassigned: true }
    }
    if (selectedDealerFilter !== 'ALL' && selectedDealerFilter !== '') {
      return { dealerId: Number(selectedDealerFilter) }
    }
    return undefined
  }, [selectedDealerFilter])

  const { data: vehicles, isLoading, isError } = useVehicles(filterParams)
  const deleteVehicle = useDeleteVehicle()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [vehicleToEdit, setVehicleToEdit] = useState<VehicleResponse | null>(null)
  const [vehicleToAssign, setVehicleToAssign] = useState<VehicleResponse | null>(null)
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleResponse | null>(null)

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return []
    const term = searchTerm.toLowerCase().trim()
    if (!term) return vehicles
    return vehicles.filter(
      (v) =>
        v.brand.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        (v.chassis && v.chassis.toLowerCase().includes(term))
    )
  }, [vehicles, searchTerm])

  const handleEdit = (vehicle: VehicleResponse) => {
    setVehicleToEdit(vehicle)
    setIsFormModalOpen(true)
  }

  const handleDelete = async () => {
    if (!vehicleToDelete) return
    try {
      await deleteVehicle.mutateAsync(vehicleToDelete.id)
      toast.success(`Veículo ${vehicleToDelete.brand} ${vehicleToDelete.model} excluído com sucesso!`)
      setVehicleToDelete(null)
    } catch {
      toast.error('Erro ao excluir veículo.')
    }
  }

  const dealerFilterOptions = [
    { value: 'ALL', label: 'Todos os Veículos' },
    { value: 'UNASSIGNED', label: 'Sem Concessionária (Estoque Central)' },
    ...(dealers?.map((d) => ({
      value: String(d.id),
      label: d.corporateName,
    })) || []),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo de Veículos"
        description="Gerenciamento de estoque, modelos, combustíveis e vínculo com concessionárias."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setVehicleToEdit(null)
              setIsFormModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Veículo
          </Button>
        }
      />

      <Card className="p-3.5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por marca, modelo ou chassi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-72">
          <Select
            options={dealerFilterOptions}
            value={selectedDealerFilter}
            onChange={(e) => setSelectedDealerFilter(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : isError ? (
        <Card className="p-8 text-center text-rose-400">
          Erro ao carregar o catálogo de veículos. Verifique a conexão com o backend.
        </Card>
      ) : filteredVehicles.length === 0 ? (
        <EmptyState
          icon={<Car className="w-6 h-6" />}
          title="Nenhum veículo encontrado"
          description={
            searchTerm || selectedDealerFilter !== 'ALL'
              ? 'Tente ajustar os filtros de busca.'
              : 'Clique em "Novo Veículo" para adicionar um veículo ao catálogo.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={(v) => setVehicleToDelete(v)}
              onAssign={(v) => setVehicleToAssign(v)}
            />
          ))}
        </div>
      )}

      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        vehicleToEdit={vehicleToEdit}
      />

      <AssignDealerModal
        isOpen={!!vehicleToAssign}
        onClose={() => setVehicleToAssign(null)}
        vehicle={vehicleToAssign}
      />

      <DeleteConfirmModal
        isOpen={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onConfirm={handleDelete}
        title="Excluir Veículo"
        description={`Deseja realmente excluir o veículo "${vehicleToDelete?.brand} ${vehicleToDelete?.model}"?`}
        isLoading={deleteVehicle.isPending}
      />
    </div>
  )
}
