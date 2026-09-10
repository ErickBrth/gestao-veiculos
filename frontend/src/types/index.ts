export type FuelType =
  | 'FLEX'
  | 'GASOLINA'
  | 'ETANOL'
  | 'DIESEL'
  | 'HIBRIDO'
  | 'ELETRICO'
  | 'GNV'

export interface Address {
  zipCode: string
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
}

export interface DealerResponse {
  id: number
  corporateName: string
  cnpj: string
  address: Address
}

export interface DealerRequest {
  corporateName: string
  cnpj: string
  address: Address
}

export interface DealerSummary {
  id: number
  corporateName: string
}

export interface VehicleResponse {
  id: number
  brand: string
  model: string
  fuelType: FuelType
  color: string
  manufactureYear: number | null
  chassis: string | null
  price: number | null
  externalColor: string | null
  dealer: DealerSummary | null
}

export interface VehicleRequest {
  brand: string
  model: string
  fuelType: FuelType
  color: string
  manufactureYear?: number | null
  chassis?: string | null
  price?: number | null
  externalColor?: string | null
  dealerId?: number | null
}

export interface AssignDealerRequest {
  dealerId: number | null
}

export interface AddressLookupResponse {
  zipCode: string
  street: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface ProblemDetail {
  type?: string
  title: string
  status: number
  detail: string
  errors?: Record<string, string>
}
