import type { DealerResponse, VehicleResponse } from '../types'

export function calculateTotalCatalogValue(vehicles?: VehicleResponse[] | null): number {
  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    return 0
  }

  return vehicles.reduce((total, vehicle) => {
    if (!vehicle || vehicle.price === null || vehicle.price === undefined) {
      return total
    }

    const price = typeof vehicle.price === 'number' ? vehicle.price : Number(vehicle.price)
    return Number.isFinite(price) && price > 0 ? total + price : total
  }, 0)
}

export function buildDealerSelectOptions(dealers?: DealerResponse[] | null, placeholder = 'Sem concessionária (Estoque Central)') {
  return [
    { value: '', label: placeholder },
    ...(dealers?.map((d) => ({
      value: String(d.id),
      label: d.corporateName ? `${d.corporateName} (ID: ${d.id})` : `Concessionária #${d.id}`,
    })) || []),
  ]
}
