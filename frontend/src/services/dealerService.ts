import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dealerApi } from '../api/dealerApi'
import type { DealerRequest } from '../types'

export const DEALERS_QUERY_KEY = ['dealers']

export function useDealers() {
  return useQuery({
    queryKey: DEALERS_QUERY_KEY,
    queryFn: dealerApi.getAll,
  })
}

export function useDealer(id?: number) {
  return useQuery({
    queryKey: ['dealer', id],
    queryFn: () => dealerApi.getById(id!),
    enabled: !!id,
  })
}

export function useDealerVehicles(dealerId?: number) {
  return useQuery({
    queryKey: ['dealer-vehicles', dealerId],
    queryFn: () => dealerApi.getVehicles(dealerId!),
    enabled: !!dealerId,
  })
}

export function useCreateDealer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DealerRequest) => dealerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALERS_QUERY_KEY })
    },
  })
}

export function useUpdateDealer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DealerRequest }) => dealerApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DEALERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['dealer', variables.id] })
    },
  })
}

export function useDeleteDealer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => dealerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
