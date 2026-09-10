import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehicleSchema, type VehicleFormData, type VehicleFormInput } from '../../schemas/vehicleSchema'
import { useCreateVehicle, useUpdateVehicle } from '../../services/vehicleService'
import { useDealers } from '../../services/dealerService'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { ApiError } from '../../api/client'
import { toast } from 'sonner'
import { FuelType, type VehicleResponse, type VehicleRequest } from '../../types'
import { buildDealerSelectOptions } from '../../utils/vehicleMetrics'

interface VehicleFormModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleToEdit?: VehicleResponse | null
}

export interface FuelOption {
  value: FuelType
  label: string
}

const FUEL_OPTIONS: FuelOption[] = [
  { value: 'FLEX', label: 'Flex' },
  { value: 'GASOLINA', label: 'Gasolina' },
  { value: 'ETANOL', label: 'Etanol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HIBRIDO', label: 'Híbrido' },
  { value: 'ELETRICO', label: 'Elétrico' },
  { value: 'GNV', label: 'GNV' },
]

export function VehicleFormModal({ isOpen, onClose, vehicleToEdit }: VehicleFormModalProps) {
  const isEditing = !!vehicleToEdit
  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()
  const { data: dealers } = useDealers()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormInput, unknown, VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: '',
      model: '',
      fuelType: FuelType.FLEX,
      color: '',
      manufactureYear: new Date().getFullYear(),
      chassis: '',
      price: null,
      externalColor: '',
      dealerId: null,
    },
  })

  useEffect(() => {
    if (vehicleToEdit) {
      reset({
        brand: vehicleToEdit.brand,
        model: vehicleToEdit.model,
        fuelType: vehicleToEdit.fuelType,
        color: vehicleToEdit.color,
        manufactureYear: vehicleToEdit.manufactureYear ?? null,
        chassis: vehicleToEdit.chassis ?? '',
        price: vehicleToEdit.price ?? null,
        externalColor: vehicleToEdit.externalColor ?? '',
        dealerId: vehicleToEdit.dealer?.id ?? null,
      })
    } else {
      reset({
        brand: '',
        model: '',
        fuelType: 'FLEX' as FuelType,
        color: '',
        manufactureYear: new Date().getFullYear(),
        chassis: '',
        price: null,
        externalColor: '',
        dealerId: null,
      })
    }
  }, [vehicleToEdit, reset])

  const onSubmit = async (data: VehicleFormData) => {
    try {
      const payload: VehicleRequest = {
        brand: data.brand,
        model: data.model,
        fuelType: data.fuelType,
        color: data.color,
        manufactureYear: data.manufactureYear ? Number(data.manufactureYear) : null,
        price: data.price ? Number(data.price) : null,
        dealerId: data.dealerId ? Number(data.dealerId) : null,
        chassis: data.chassis?.trim() || null,
        externalColor: data.externalColor?.trim() || null,
      }

      if (isEditing && vehicleToEdit) {
        await updateVehicle.mutateAsync({ id: vehicleToEdit.id, data: payload })
        toast.success('Veículo atualizado com sucesso!')
      } else {
        await createVehicle.mutateAsync(payload)
        toast.success('Veículo cadastrado com sucesso!')
      }
      onClose()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.problemDetail.errors) {
          Object.entries(err.problemDetail.errors).forEach(([field, msg]) => {
            setError(field as Parameters<typeof setError>[0], { message: msg })
          })
        }
        toast.error(err.problemDetail.detail || err.problemDetail.title)
      } else {
        toast.error('Ocorreu um erro ao salvar o veículo.')
      }
    }
  }

  const dealerOptions = buildDealerSelectOptions(dealers, 'Sem concessionária (Estoque central)')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Veículo' : 'Novo Veículo'}
      description="Preencha os dados do veículo para o catálogo comercial."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Marca"
            placeholder="Ex: Toyota"
            error={errors.brand?.message}
            {...register('brand')}
          />

          <Input
            label="Modelo"
            placeholder="Ex: Corolla"
            error={errors.model?.message}
            {...register('model')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            label="Combustível"
            options={FUEL_OPTIONS}
            error={errors.fuelType?.message}
            {...register('fuelType')}
          />

          <Input
            label="Cor Predominante"
            placeholder="Ex: Branco"
            error={errors.color?.message}
            {...register('color')}
          />

          <Input
            label="Cor Externa (Opcional)"
            placeholder="Ex: Teto Preto"
            error={errors.externalColor?.message}
            {...register('externalColor')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Ano Fabricação"
            type="number"
            placeholder="2025"
            error={errors.manufactureYear?.message}
            {...register('manufactureYear')}
          />

          <Input
            label="Chassi (17 Caracteres)"
            placeholder="9BWZZZ377VT004251"
            maxLength={17}
            error={errors.chassis?.message}
            {...register('chassis')}
          />

          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            placeholder="95000.00"
            error={errors.price?.message}
            {...register('price')}
          />
        </div>

        <Select
          label="Concessionária Responsável"
          options={dealerOptions}
          error={errors.dealerId?.message}
          {...register('dealerId')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
