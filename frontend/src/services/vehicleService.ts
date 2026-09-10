import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { vehicleApi, type VehicleFilterParams } from '../api/vehicleApi'
import type { AssignDealerRequest, VehicleRequest } from '../types'

export const VEHICLES_QUERY_KEY = ['vehicles']

export function useVehicles(filters?: VehicleFilterParams) {
  return useQuery({
    queryKey: [...VEHICLES_QUERY_KEY, filters],
    queryFn: () => vehicleApi.getAll(filters),
  })
}

export function useVehicle(id?: number) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleApi.getById(id!),
    enabled: !!id,
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: VehicleRequest) => vehicleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VehicleRequest }) => vehicleApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] })
    },
  })
}

export function useAssignDealer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssignDealerRequest }) => vehicleApi.assignDealer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['dealers'] })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => vehicleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY })
    },
  })
}
