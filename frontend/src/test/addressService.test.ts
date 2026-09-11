import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAddressLookup } from '../services/addressService'
import { addressApi } from '../api/addressApi'
import { ApiError } from '../api/client'
import { addressLookupFactory, problemDetailFactory } from './factories'

vi.mock('../api/addressApi', () => ({
  addressApi: { lookup: vi.fn() },
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
  ])('returns incomplete and skips the API call for %s', async (_, zipCode) => {
    const { returnValue } = await callLookup(zipCode)

    expect(returnValue).toEqual({ status: 'incomplete' })
    expect(addressApi.lookup).not.toHaveBeenCalled()
  })
})

describe('useAddressLookup — successful lookup', () => {
  beforeEach(() => vi.clearAllMocks())

  it('strips formatting from the CEP before calling the API', async () => {
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(addressLookupFactory.build())

    await callLookup('01001-000')

    expect(addressApi.lookup).toHaveBeenCalledWith('01001000')
  })

  it('returns found with the address payload', async () => {
    const mockAddress = addressLookupFactory.build()
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(mockAddress)

    const { returnValue, result } = await callLookup('01001000')

    expect(returnValue).toEqual({ status: 'found', address: mockAddress })
    expect(result.current.isLoading).toBe(false)
  })

  it('works with a valid CEP that has no complement', async () => {
    const mockAddress = addressLookupFactory.build({ complement: undefined })
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(mockAddress)

    const { returnValue } = await callLookup('58400000')

    expect(returnValue).toEqual({ status: 'found', address: mockAddress })
  })
})

describe('useAddressLookup — error handling', () => {
  beforeEach(() => vi.clearAllMocks())

  it('maps a 404 to not-found, so the form can block the submit', async () => {
    const problem = problemDetailFactory.buildNotFound('CEP 99999999 não encontrado')
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new ApiError(problem))

    const { returnValue } = await callLookup('99999999')

    expect(returnValue).toEqual({ status: 'not-found' })
  })

  it('maps a 409 to unavailable, so a provider outage does not block the submit', async () => {
    const problem = problemDetailFactory.buildConflict('Serviço de CEP indisponível')
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new ApiError(problem))

    const { returnValue } = await callLookup('01001000')

    expect(returnValue).toEqual({ status: 'unavailable' })
  })

  it('maps a 500 to unavailable', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(
      new ApiError(problemDetailFactory.buildServerError())
    )

    const { returnValue } = await callLookup('01001000')

    expect(returnValue).toEqual({ status: 'unavailable' })
  })

  it('treats a network failure as unavailable', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new Error('Network Error'))

    const { returnValue } = await callLookup('01001000')

    expect(returnValue).toEqual({ status: 'unavailable' })
  })

  it('treats a non-Error thrown value as unavailable', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce('unexpected string error')

    const { returnValue } = await callLookup('01001000')

    expect(returnValue).toEqual({ status: 'unavailable' })
  })

  it('always resets isLoading to false after an error', async () => {
    vi.mocked(addressApi.lookup).mockRejectedValueOnce(new Error('timeout'))

    const { result } = await callLookup('12345678')

    expect(result.current.isLoading).toBe(false)
  })
})

describe('useAddressLookup — verification state', () => {
  beforeEach(() => vi.clearAllMocks())

  it('marks a CEP as verified after a successful lookup', async () => {
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(addressLookupFactory.build())

    const { result } = await callLookup('01001-000')

    expect(result.current.isVerified('01001000')).toBe(true)
    expect(result.current.isVerified('01001-000')).toBe(true)
  })

  it('does not mark a different CEP as verified', async () => {
    vi.mocked(addressApi.lookup).mockResolvedValueOnce(addressLookupFactory.build())

    const { result } = await callLookup('01001000')

    expect(result.current.isVerified('58400000')).toBe(false)
  })

  it('clears the verified CEP when a lookup fails', async () => {
    vi.mocked(addressApi.lookup)
      .mockResolvedValueOnce(addressLookupFactory.build())
      .mockRejectedValueOnce(new ApiError(problemDetailFactory.buildNotFound()))

    const { result } = renderHook(() => useAddressLookup())

    await act(async () => {
      await result.current.lookup('01001000')
    })
    expect(result.current.isVerified('01001000')).toBe(true)

    await act(async () => {
      await result.current.lookup('99999999')
    })
    expect(result.current.isVerified('01001000')).toBe(false)
  })

  it('trustZipCode marks a stored CEP as verified without calling the API', () => {
    const { result } = renderHook(() => useAddressLookup())

    act(() => {
      result.current.trustZipCode('58400-000')
    })

    expect(result.current.isVerified('58400000')).toBe(true)
    expect(addressApi.lookup).not.toHaveBeenCalled()
  })
})