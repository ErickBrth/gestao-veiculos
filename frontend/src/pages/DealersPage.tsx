import { useState, useMemo } from 'react'
import { useDealers, useDeleteDealer } from '../services/dealerService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { DealerCard } from '../components/dealer/DealerCard'
import { PageHeader } from '../components/shared/PageHeader'
import { EmptyState } from '../components/shared/EmptyState'
import { DealerFormModal } from '../components/dealer/DealerFormModal'
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal'
import type { DealerResponse } from '../types'
import { Building2, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

export function DealersPage() {
  const { data: dealers, isLoading, isError } = useDealers()
  const deleteDealer = useDeleteDealer()

  const [searchTerm, setSearchTerm] = useState('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [dealerToEdit, setDealerToEdit] = useState<DealerResponse | null>(null)
  const [dealerToDelete, setDealerToDelete] = useState<DealerResponse | null>(null)

  const filteredDealers = useMemo(() => {
    if (!dealers) return []
    const term = searchTerm.toLowerCase().trim()
    if (!term) return dealers
    return dealers.filter(
      (d) =>
        d.corporateName.toLowerCase().includes(term) ||
        d.cnpj.includes(term.replace(/\D/g, '')) ||
        d.address.city.toLowerCase().includes(term)
    )
  }, [dealers, searchTerm])

  const handleEdit = (dealer: DealerResponse) => {
    setDealerToEdit(dealer)
    setIsFormModalOpen(true)
  }

  const handleDelete = async () => {
    if (!dealerToDelete) return
    try {
      await deleteDealer.mutateAsync(dealerToDelete.id)
      toast.success(`Concessionária ${dealerToDelete.corporateName} excluída com sucesso!`)
      setDealerToDelete(null)
    } catch {
      toast.error('Erro ao excluir concessionária.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Concessionárias"
        description="Gerencie as concessionárias da rede autorizada e seus endereços oficiais."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setDealerToEdit(null)
              setIsFormModalOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Concessionária
          </Button>
        }
      />

      <Card className="p-3.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por razão social, CNPJ ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <Card className="p-8 text-center text-rose-400">
          Erro ao carregar a lista de concessionárias. Verifique se o backend está ativo.
        </Card>
      ) : filteredDealers.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-6 h-6" />}
          title="Nenhuma concessionária encontrada"
          description={
            searchTerm
              ? 'Tente ajustar os termos da busca.'
              : 'Clique em "Nova Concessionária" para começar.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDealers.map((dealer) => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              onEdit={handleEdit}
              onDelete={(d) => setDealerToDelete(d)}
            />
          ))}
        </div>
      )}

      <DealerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        dealerToEdit={dealerToEdit}
      />

      <DeleteConfirmModal
        isOpen={!!dealerToDelete}
        onClose={() => setDealerToDelete(null)}
        onConfirm={handleDelete}
        title="Excluir Concessionária"
        description={`Deseja realmente excluir a concessionária "${dealerToDelete?.corporateName}"? Os veículos associados a ela serão desvinculados para o Estoque Central.`}
        isLoading={deleteDealer.isPending}
      />
    </div>
  )
}
