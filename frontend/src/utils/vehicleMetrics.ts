import type { DealerResponse, VehicleResponse } from '../types'

export function calculateTotalCatalogValue(vehicles?: VehicleResponse[] | null): number {
  if (!vehicles) {
    return 0
  }

  return vehicles.reduce(
    (total, vehicle) => (vehicle.price === null ? total : total + vehicle.price),
    0
  )
}

export function buildDealerSelectOptions(
  dealers?: DealerResponse[] | null,
  placeholder = 'Sem concessionária (Estoque Central)'
) {
  return [
    { value: '', label: placeholder },
    ...(dealers ?? []).map((dealer) => ({
      value: String(dealer.id),
      label: `${dealer.corporateName} (ID: ${dealer.id})`,
    })),
  ]
}