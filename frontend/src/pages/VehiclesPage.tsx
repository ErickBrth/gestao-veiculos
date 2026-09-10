import { useState, useMemo } from 'react'
import { useVehicles, useDeleteVehicle } from '../services/vehicleService'
import { useDealers } from '../services/dealerService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Badge, FuelBadge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { VehicleFormModal } from '../components/vehicle/VehicleFormModal'
import { AssignDealerModal } from '../components/vehicle/AssignDealerModal'
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal'
import type { VehicleResponse } from '../types'
import { Car, Plus, Search, Edit2, Trash2, Link2, Building2, Unlink } from 'lucide-react'
import { toast } from 'sonner'

export function VehiclesPage() {
  const [selectedDealerFilter, setSelectedDealerFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: dealers } = useDealers()

  // Calculate backend filter params
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Car className="w-7 h-7 text-indigo-400" />
            Catálogo de Veículos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gerenciamento de estoque, modelos, combustíveis e vínculo com concessionárias.
          </p>
        </div>
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
      </div>

      {/* Filter Bar */}
      <Card className="p-3.5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Buscar por marca, modelo ou chassi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-950/60"
          />
        </div>

        <div className="w-full md:w-72">
          <Select
            options={dealerFilterOptions}
            value={selectedDealerFilter}
            onChange={(e) => setSelectedDealerFilter(e.target.value)}
            className="bg-slate-950/60"
          />
        </div>
      </Card>

      {/* Vehicles Grid */}
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
        <Card className="p-12 text-center text-slate-400">
          <Car className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-base text-slate-200">Nenhum veículo encontrado</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || selectedDealerFilter !== 'ALL'
              ? 'Tente ajustar os filtros de busca.'
              : 'Clique em "Novo Veículo" para adicionar um veículo ao catálogo.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {vehicle.color}{' '}
                      {vehicle.externalColor ? `(${vehicle.externalColor})` : ''}{' '}
                      {vehicle.manufactureYear ? `• Ano ${vehicle.manufactureYear}` : ''}
                    </p>
                  </div>
                  <FuelBadge fuelType={vehicle.fuelType} />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Chassi</span>
                    <span className="font-mono text-slate-300">
                      {vehicle.chassis || 'Não informado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Preço</span>
                    <span className="font-semibold text-slate-100">
                      {vehicle.price
                        ? new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(Number(vehicle.price))
                        : 'Sob consulta'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Concessionária</span>
                    {vehicle.dealer ? (
                      <span className="inline-flex items-center gap-1 text-indigo-400 font-medium truncate max-w-[170px]">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{vehicle.dealer.corporateName}</span>
                      </span>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <Unlink className="w-3 h-3" />
                        Estoque Central
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVehicleToAssign(vehicle)}
                  className="text-xs gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                  Vincular
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                    title="Editar"
                    aria-label={`Editar ${vehicle.brand} ${vehicle.model}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVehicleToDelete(vehicle)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Excluir"
                    aria-label={`Excluir ${vehicle.brand} ${vehicle.model}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
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
