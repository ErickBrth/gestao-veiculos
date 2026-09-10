import { apiClient } from './client'
import type { DealerRequest, DealerResponse, VehicleResponse } from '../types'

export const dealerApi = {
  getAll: async (): Promise<DealerResponse[]> => {
    const response = await apiClient.get<DealerResponse[]>('/dealer')
    return response.data
  },

  getById: async (id: number): Promise<DealerResponse> => {
    const response = await apiClient.get<DealerResponse>(`/dealer/${id}`)
    return response.data
  },

  create: async (payload: DealerRequest): Promise<DealerResponse> => {
    const response = await apiClient.post<DealerResponse>('/dealer', payload)
    return response.data
  },

  update: async (id: number, payload: DealerRequest): Promise<DealerResponse> => {
    const response = await apiClient.put<DealerResponse>(`/dealer/${id}`, payload)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/dealer/${id}`)
  },

  getVehicles: async (dealerId: number): Promise<VehicleResponse[]> => {
    const response = await apiClient.get<VehicleResponse[]>(`/dealer/${dealerId}/vehicles`)
    return response.data
  },
}
