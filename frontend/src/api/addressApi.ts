import { apiClient } from './client'
import type { AddressLookupResponse } from '../types'

export const addressApi = {
  lookup: async (zipCode: string): Promise<AddressLookupResponse> => {
    const cleanZip = zipCode.replace(/\D/g, '')
    const response = await apiClient.get<AddressLookupResponse>(`/addresses/${cleanZip}`)
    return response.data
  },
}
