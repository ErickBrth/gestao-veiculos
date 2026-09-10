import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAddressLookup } from '../services/addressService'
import { addressApi } from '../api/addressApi'
import { ApiError } from '../api/client'
import { addressLookupFactory, problemDetailFactory } from './factories'
import { toast } from 'sonner'

vi.mock('../api/addressApi', () => ({
  addressApi: { lookup: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
}))

async function callLookup(zipCode: string) {
  const { result } = renderHook(() => useAddressLookup())
  let returnValue: Awaited<ReturnType<typeof result.current.lookup>>
  await act(async () => {
    returnValue = await result.current.lookup(zipCode)
  })
  return { result, returnValue: returnValue! }
}

describe('useAddressLookup — guard clauses', () => {
  beforeEach(() => vi.clearAllMocks())

  it.each([
    ['empty string', ''],
    ['3 digits', '123'],
    ['7 digits', '1234567'],
    ['only dashes and spaces', '----    '],
  ])('returns null and skips the API call for %s', async (_, zipCode) => {
    const { returnValue } = await callLookup(zipCode)

    expect(returnValue).toBeNull()
    expect(addressApi.lookup).not.toHaveBeenCalled()
  })
})

describe('useAddressLookup — successful lookup', () => {
  beforeEach(() => vi.clearAllMocks())

  it('strips formatting from CEP before calling the API', async () => {
    const mockAddress = addressLookupFactory.build()
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(mockAddress)

    await callLookup('01001-000')

    expect(addressApi.lookup).toHaveBeenCalledWith('01001000')
  })

  it('returns the address data and shows a success toast', async () => {
    const mockAddress = addressLookupFactory.build()
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(mockAddress)

    const { returnValue, result } = await callLookup('01001000')

    expect(returnValue).toEqual(mockAddress)
    expect(toast.success).toHaveBeenCalledWith('Endereço localizado com sucesso!')
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('works with a valid CEP that has no complement', async () => {
    const mockAddress = addressLookupFactory.build({ complement: undefined })
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(mockAddress)

    const { returnValue } = await callLookup('58400000')

    expect(returnValue?.complement).toBeUndefined()
  })
})

describe('useAddressLookup — error handling', () => {
  beforeEach(() => vi.clearAllMocks())

  it('handles a generic Error and shows the message as a warning toast', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new Error('CEP não encontrado'))

    const { returnValue, result } = await callLookup('99999999')

    expect(returnValue).toBeNull()
    expect(result.current.error).toBe('CEP não encontrado')
    expect(toast.warning).toHaveBeenCalledWith('CEP não encontrado')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles a 404 ApiError with a user-readable message', async () => {
    const problem = problemDetailFactory.buildNotFound('CEP 99999999 não encontrado')
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new ApiError(problem))

    const { returnValue, result } = await callLookup('99999999')

    expect(returnValue).toBeNull()
    expect(result.current.error).toBe('CEP 99999999 não encontrado')
    expect(toast.warning).toHaveBeenCalled()
  })

  it('handles a 409 ApiError gracefully', async () => {
    const problem = problemDetailFactory.buildConflict('Serviço de CEP indisponível no momento')
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new ApiError(problem))

    const { returnValue, result } = await callLookup('01001000')

    expect(returnValue).toBeNull()
    expect(result.current.error).toBe('Serviço de CEP indisponível no momento')
  })

  it('falls back to a generic message for non-Error thrown values', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce('unexpected string error')

    const { returnValue, result } = await callLookup('01001000')

    expect(returnValue).toBeNull()
    expect(result.current.error).toBe(
      'Não foi possível preencher o endereço automaticamente.'
    )
  })

  it('always resets isLoading to false after an error', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new Error('timeout'))

    const { result } = await callLookup('12345678')

    expect(result.current.isLoading).toBe(false)
  })
})
