import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dealerSchema, type DealerFormData } from '../../schemas/dealerSchema'
import { useAddressLookup } from '../../services/addressService'
import { useCreateDealer, useUpdateDealer } from '../../services/dealerService'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { ApiError } from '../../api/client'
import { toast } from 'sonner'
import type { DealerResponse } from '../../types'
import { Loader2 } from 'lucide-react'
import { maskCnpj, maskZipCode } from '../../utils/format'
import { Select } from '../ui/Select'
import { BRAZILIAN_STATES } from '../../utils/brazilianStates'

interface DealerFormModalProps {
  isOpen: boolean
  onClose: () => void
  dealerToEdit?: DealerResponse | null
}

const EMPTY_FORM: DealerFormData = {
  corporateName: '',
  cnpj: '',
  address: {
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  },
}

export function DealerFormModal({ isOpen, onClose, dealerToEdit }: DealerFormModalProps) {
  const isEditing = !!dealerToEdit
  const createDealer = useCreateDealer()
  const updateDealer = useUpdateDealer()
  const { lookup, isLoading: isLookingUpAddress, isVerified, trustZipCode } = useAddressLookup()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealerFormData>({
    resolver: zodResolver(dealerSchema),
    defaultValues: EMPTY_FORM,
  })

  const cnpjField = register('cnpj')
  const zipField = register('address.zipCode')

  useEffect(() => {
    if (dealerToEdit) {
      reset({
        corporateName: dealerToEdit.corporateName,
        cnpj: maskCnpj(dealerToEdit.cnpj),
        address: {
          zipCode: maskZipCode(dealerToEdit.address.zipCode || ''),
          street: dealerToEdit.address.street || '',
          number: dealerToEdit.address.number || '',
          complement: dealerToEdit.address.complement || '',
          neighborhood: dealerToEdit.address.neighborhood || '',
          city: dealerToEdit.address.city || '',
          state: dealerToEdit.address.state || '',
        },
      })
      trustZipCode(dealerToEdit.address.zipCode || '')
    } else {
      reset({
        corporateName: '',
        cnpj: '',
        address: {
          zipCode: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
        },
      })
    }
  }, [dealerToEdit, reset, trustZipCode])

  const handleZipBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const result = await lookup(e.target.value)

    switch (result.status) {
      case 'found':
        clearErrors('address.zipCode')
        setValue('address.street', result.address.street || '', { shouldValidate: true })
        setValue('address.neighborhood', result.address.neighborhood || '', { shouldValidate: true })
        setValue('address.city', result.address.city || '', { shouldValidate: true })
        setValue('address.state', result.address.state || '', { shouldValidate: true })
        if (result.address.complement) {
          setValue('address.complement', result.address.complement)
        }
        toast.success('Endereço localizado.')
        break

      case 'not-found':
        setError('address.zipCode', { type: 'manual', message: 'CEP não encontrado' })
        break

      case 'unavailable':
        toast.warning('Consulta de CEP indisponível. Preencha o endereço manualmente.')
        break

      case 'incomplete':
        break
    }
  }

  const onSubmit = async (data: DealerFormData) => {
    if (!isVerified(data.address.zipCode)) {
      const result = await lookup(data.address.zipCode)

      if (result.status === 'not-found') {
        setError(
          'address.zipCode',
          { type: 'manual', message: 'CEP não encontrado' },
          { shouldFocus: true }
        )
        return
      }

      if (result.status === 'unavailable') {
        toast.warning('Não foi possível confirmar o CEP. Cadastro prosseguirá com o endereço informado.')
      }
    }

    try {
      if (isEditing && dealerToEdit) {
        await updateDealer.mutateAsync({ id: dealerToEdit.id, data })
        toast.success('Concessionária atualizada com sucesso!')
      } else {
        await createDealer.mutateAsync(data)
        toast.success('Concessionária cadastrada com sucesso!')
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
        toast.error('Ocorreu um erro ao salvar concessionária.')
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Concessionária' : 'Nova Concessionária'}
      description="Preencha os dados da concessionária e o endereço via CEP."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Razão Social"
            placeholder="Ex: Concessionária Norte LTDA"
            error={errors.corporateName?.message}
            {...register('corporateName')}
          />

          <Input
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            inputMode="numeric"
            autoComplete="off"
            maxLength={18}
            error={errors.cnpj?.message}
            {...cnpjField}
            onChange={(e) => {
              e.target.value = maskCnpj(e.target.value)
              cnpjField.onChange(e)
            }}
          />
        </div>

        <div className="border-t border-slate-200 pt-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Endereço
            </h4>
            {isLookingUpAddress && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando CEP...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="CEP"
              placeholder="00000-000"
              inputMode="numeric"
              autoComplete="off"
              maxLength={9}
              error={errors.address?.zipCode?.message}
              {...zipField}
              onChange={(e) => {
                e.target.value = maskZipCode(e.target.value)
                zipField.onChange(e)
              }}
              onBlur={(e) => {
                zipField.onBlur(e)
                handleZipBlur(e)
              }}
            />

            <div className="md:col-span-2">
              <Input
                label="Logradouro"
                placeholder="Rua, Av, etc."
                error={errors.address?.street?.message}
                {...register('address.street')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input
              label="Número"
              placeholder="123"
              error={errors.address?.number?.message}
              {...register('address.number')}
            />

            <div className="md:col-span-2">
              <Input
                label="Complemento (Opcional)"
                placeholder="Apto, Sala, Bloco..."
                error={errors.address?.complement?.message}
                {...register('address.complement')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input
              label="Bairro"
              placeholder="Centro"
              error={errors.address?.neighborhood?.message}
              {...register('address.neighborhood')}
            />

            <Input
              label="Cidade"
              placeholder="São Paulo"
              error={errors.address?.city?.message}
              {...register('address.city')}
            />

            <Select
              label="UF"
              placeholder="Selecione"
              options={BRAZILIAN_STATES}
              error={errors.address?.state?.message}
              {...register('address.state')}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isLookingUpAddress}
          >
            {isEditing ? 'Atualizar Concessionária' : 'Cadastrar Concessionária'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
