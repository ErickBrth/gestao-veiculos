import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge, FuelBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DeleteConfirmModal } from '../components/ui/DeleteConfirmModal'
import { FUEL_BADGE_FIXTURES } from './fixtures'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Estoque Central</Badge>)
    expect(screen.getByText('Estoque Central')).toBeInTheDocument()
  })

  it('applies the default variant class when no variant is specified', () => {
    render(<Badge>Tag</Badge>)
    expect(screen.getByText('Tag')).toBeInTheDocument()
  })
})

describe('FuelBadge', () => {
  it.each(FUEL_BADGE_FIXTURES)('renders "$label" for fuelType $fuelType', ({ fuelType, label }) => {
    render(<FuelBadge fuelType={fuelType} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

describe('Button', () => {
  it('renders its label and is accessible via role', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Enviar</Button>)

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and does not call onClick when isLoading is true', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Processando</Button>)

    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await user.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows the label text while loading', () => {
    render(<Button isLoading>Salvando…</Button>)
    expect(screen.getByText('Salvando…')).toBeInTheDocument()
  })
})

describe('Input', () => {
  it('renders a labelled input accessible by its label text', () => {
    render(<Input label="Razão Social" name="corporateName" />)
    expect(screen.getByLabelText('Razão Social')).toBeInTheDocument()
  })

  it('displays an error message below the input', () => {
    render(<Input label="CNPJ" name="cnpj" error="CNPJ inválido" />)
    expect(screen.getByText('CNPJ inválido')).toBeInTheDocument()
  })

  it('does not display an error section when no error is provided', () => {
    render(<Input label="Email" name="email" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('forwards typed characters to the input element', async () => {
    const user = userEvent.setup()
    render(<Input label="Marca" name="brand" />)
    const input = screen.getByLabelText('Marca')
    await user.type(input, 'Toyota')
    expect(input).toHaveValue('Toyota')
  })
})

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Excluir Concessionária',
    description: 'Tem certeza que deseja excluir esta concessionária?',
  }

  it('renders title and description when open', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    expect(screen.getByText('Excluir Concessionária')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza que deseja excluir esta concessionária?')).toBeInTheDocument()
  })

  it('does not render content when isOpen is false', () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Excluir Concessionária')).not.toBeInTheDocument()
  })

  it('calls onConfirm when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<DeleteConfirmModal {...defaultProps} onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DeleteConfirmModal {...defaultProps} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('disables the confirm button and shows loading state', () => {
    render(<DeleteConfirmModal {...defaultProps} isLoading />)
    const deleteBtn = screen.getByRole('button', { name: 'Excluir' })
    expect(deleteBtn).toBeDisabled()
  })
})
