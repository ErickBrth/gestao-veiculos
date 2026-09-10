import { apiClient } from './client'
import type { AssignDealerRequest, VehicleRequest, VehicleResponse } from '../types'

export interface VehicleFilterParams {
  dealerId?: number
  unassigned?: boolean
}

export const vehicleApi = {
  getAll: async (params?: VehicleFilterParams): Promise<VehicleResponse[]> => {
    const response = await apiClient.get<VehicleResponse[]>('/vehicles', { params })
    return response.data
  },

  getById: async (id: number): Promise<VehicleResponse> => {
    const response = await apiClient.get<VehicleResponse>(`/vehicles/${id}`)
    return response.data
  },

  create: async (payload: VehicleRequest): Promise<VehicleResponse> => {
    const response = await apiClient.post<VehicleResponse>('/vehicles', payload)
    return response.data
  },

  update: async (id: number, payload: VehicleRequest): Promise<VehicleResponse> => {
    const response = await apiClient.put<VehicleResponse>(`/vehicles/${id}`, payload)
    return response.data
  },

  assignDealer: async (id: number, payload: AssignDealerRequest): Promise<VehicleResponse> => {
    const response = await apiClient.patch<VehicleResponse>(`/vehicles/${id}/dealer`, payload)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`)
  },
}
