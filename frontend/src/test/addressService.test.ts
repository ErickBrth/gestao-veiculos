import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAddressLookup } from '../services/addressService'
import { addressApi } from '../api/addressApi'
import { toast } from 'sonner'

vi.mock('../api/addressApi', () => ({
  addressApi: {
    lookup: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useAddressLookup service hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ignores invalid or short zipCodes without calling API', async () => {
    const { result } = renderHook(() => useAddressLookup())

    let data: Awaited<ReturnType<typeof result.current.lookup>>
    await act(async () => {
      data = await result.current.lookup('123')
    })

    expect(data!).toBeNull()
    expect(addressApi.lookup).not.toHaveBeenCalled()
  })

  it('successfully fetches and returns address on valid 8 digit CEP', async () => {
    const mockAddress = {
      zipCode: '01001000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
      complement: 'lado ímpar',
    }
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(mockAddress)

    const { result } = renderHook(() => useAddressLookup())

    let data: Awaited<ReturnType<typeof result.current.lookup>>
    await act(async () => {
      data = await result.current.lookup('01001-000')
    })

    expect(addressApi.lookup).toHaveBeenCalledWith('01001000')
    expect(data).toEqual(mockAddress)
    expect(toast.success).toHaveBeenCalledWith('Endereço localizado com sucesso!')
    expect(result.current.error).toBeNull()
  })

  it('handles lookup failure gracefully and updates error state', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new Error('CEP não encontrado'))

    const { result } = renderHook(() => useAddressLookup())

    let data: Awaited<ReturnType<typeof result.current.lookup>>
    await act(async () => {
      data = await result.current.lookup('99999-999')
    })

    expect(data!).toBeNull()
    expect(result.current.error).toBe('CEP não encontrado')
    expect(toast.warning).toHaveBeenCalledWith('CEP não encontrado')
  })
})
