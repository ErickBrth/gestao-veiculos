import { useCallback, useRef, useState } from 'react'
import { addressApi } from '../api/addressApi'
import { ApiError } from '../api/client'
import type { AddressLookupResponse } from '../types'

export type AddressLookupResult =
  | { status: 'found'; address: AddressLookupResponse }
  | { status: 'not-found' }
  | { status: 'unavailable' }
  | { status: 'incomplete' }

export function useAddressLookup() {
  const [isLoading, setIsLoading] = useState(false)

  const verifiedZipCode = useRef<string | null>(null)
  const lookup = useCallback(async (zipCode: string): Promise<AddressLookupResult> => {
    const digits = zipCode.replace(/\D/g, '')

    if (digits.length !== 8) {
      return { status: 'incomplete' }
    }

    setIsLoading(true)
    try {
      const address = await addressApi.lookup(digits)
      verifiedZipCode.current = digits
      return { status: 'found', address }
    } catch (err: unknown) {
      verifiedZipCode.current = null

      if (err instanceof ApiError && err.problemDetail.status === 404) {
        return { status: 'not-found' }
      }
      return { status: 'unavailable' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const isVerified = useCallback(
    (zipCode: string) => verifiedZipCode.current === zipCode.replace(/\D/g, ''),
    []
  )

  const trustZipCode = useCallback((zipCode: string) => {
    verifiedZipCode.current = zipCode.replace(/\D/g, '')
  }, [])

  return { lookup, isLoading, isVerified, trustZipCode }
}