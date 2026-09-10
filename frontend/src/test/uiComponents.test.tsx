import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge, FuelBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal'

describe('UI Components', () => {
  describe('Badge & FuelBadge', () => {
    it('renders Badge with default variant', () => {
      render(<Badge>Default Tag</Badge>)
      expect(screen.getByText('Default Tag')).toBeInTheDocument()
    })

    it('renders FuelBadge with correct labels and variants for fuels', () => {
      const { rerender } = render(<FuelBadge fuelType="FLEX" />)
      expect(screen.getByText('Flex')).toBeInTheDocument()

      rerender(<FuelBadge fuelType="ELETRICO" />)
      expect(screen.getByText('Elétrico')).toBeInTheDocument()

      rerender(<FuelBadge fuelType="HIBRIDO" />)
      expect(screen.getByText('Híbrido')).toBeInTheDocument()

      rerender(<FuelBadge fuelType="DIESEL" />)
      expect(screen.getByText('Diesel')).toBeInTheDocument()
    })
  })

  describe('Button', () => {
    it('renders label and handles click', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Salvar</Button>)

      const btn = screen.getByRole('button', { name: 'Salvar' })
      expect(btn).toBeInTheDocument()
      await user.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('shows loading spinner and disables button when isLoading is true', () => {
      render(<Button isLoading>Processando</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(screen.getByText('Processando')).toBeInTheDocument()
    })
  })

  describe('Input', () => {
    it('displays error message when error prop is provided', () => {
      render(<Input label="Razão Social" name="corporateName" error="Campo obrigatório" />)
      expect(screen.getByLabelText('Razão Social')).toBeInTheDocument()
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    })
  })

  describe('DeleteConfirmModal', () => {
    it('calls onConfirm when clicking confirm button', async () => {
      const user = userEvent.setup()
      const onConfirm = vi.fn()
      const onClose = vi.fn()

      render(
        <DeleteConfirmModal
          isOpen={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title="Excluir Concessionária"
          description="Tem certeza que deseja excluir?"
        />
      )

      expect(screen.getByText('Excluir Concessionária')).toBeInTheDocument()
      expect(screen.getByText('Tem certeza que deseja excluir?')).toBeInTheDocument()

      const deleteBtn = screen.getByRole('button', { name: 'Excluir' })
      await user.click(deleteBtn)
      expect(onConfirm).toHaveBeenCalledTimes(1)

      const cancelBtn = screen.getByRole('button', { name: 'Cancelar' })
      await user.click(cancelBtn)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
