import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'
import type { DeleteConfirmModalProps } from './types'

export type { DeleteConfirmModalProps }

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  description = 'Esta ação não pode ser desfeita. Tem certeza que deseja excluir este registro?',
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4 text-center py-2">
        <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        <div className="flex items-center justify-center gap-2.5 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}
