import { useState } from 'react'
import { addressApi } from '../api/addressApi'
import type { AddressLookupResponse } from '../types'
import { toast } from 'sonner'

export function useAddressLookup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async (zipCode: string): Promise<AddressLookupResponse | null> => {
    const cleanZip = zipCode.replace(/\D/g, '')
    if (cleanZip.length !== 8) {
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await addressApi.lookup(cleanZip)
      toast.success('Endereço localizado com sucesso!')
      return data
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Não foi possível preencher o endereço automaticamente.'
      setError(message)
      toast.warning(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { lookup, isLoading, error }
}
