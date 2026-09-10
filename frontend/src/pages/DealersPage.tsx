import { useState, useMemo } from 'react'
import { useDealers, useDeleteDealer } from '../services/dealerService'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { DealerFormModal } from '../components/dealer/DealerFormModal'
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal'
import type { DealerResponse } from '../types'
import { Building2, Plus, Search, Edit2, Trash2, Car, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
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

  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-400" />
            Concessionárias
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie as concessionárias da rede autorizada e seus endereços oficiais.
          </p>
        </div>
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
      </div>

      {/* Filter Bar */}
      <Card className="p-3.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Buscar por razão social, CNPJ ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-950/60"
          />
        </div>
      </Card>

      {/* Content Table / Cards */}
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
        <Card className="p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-base text-slate-200">Nenhuma concessionária encontrada</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm
              ? 'Tente ajustar os termos da busca.'
              : 'Clique em "Nova Concessionária" para começar.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDealers.map((dealer) => (
            <Card key={dealer.id} className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">
                      {dealer.corporateName}
                    </h3>
                    <span className="text-xs font-mono text-indigo-400 mt-0.5 block">
                      CNPJ: {formatCnpj(dealer.cnpj)}
                    </span>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    ID #{dealer.id}
                  </span>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    {dealer.address.street}, {dealer.address.number}
                    {dealer.address.complement ? ` - ${dealer.address.complement}` : ''}
                    <br />
                    {dealer.address.neighborhood}, {dealer.address.city} - {dealer.address.state} • CEP:{' '}
                    {dealer.address.zipCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <Link
                  to={`/dealers/${dealer.id}/vehicles`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-colors"
                >
                  <Car className="w-3.5 h-3.5" />
                  Frota Vinculada
                </Link>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(dealer)}
                    title="Editar"
                    aria-label={`Editar ${dealer.corporateName}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDealerToDelete(dealer)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Excluir"
                    aria-label={`Excluir ${dealer.corporateName}`}
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
