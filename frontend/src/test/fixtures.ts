import type { FuelType } from '../types'

export const VALID_CNPJS = [
  '12345678000195',
  '11222333000181',
  '98765432000198',
  '11.222.333/0001-81',
]

export const INVALID_CNPJS = [
  '11.222.333/0001-82',
  '98765432000110',
  '00000000000000',
  '11111111111111',
  '1234567890123',
  '123456789012345',
  'AB.CDE.FGH/IJKL-MN',
]

export const VALID_CHASSIS = [
  '9BWZZZ377VT004251',
  '9BD19712MP1234567',
  'JTDBR32E60W123456',
  'LC0CE4CB5P0100003',
]

export const INVALID_CHASSIS = [
  'INVALID_CHASSIS_1',
  '9BWZZZ377VT00425',
  '9BWZZZ377VT0042512',
  '9BWZZZ377VT0042IO',
  '9BWZZZ377VT00425Q',
]

export const VALID_FUEL_TYPES: FuelType[] = [
  'FLEX',
  'GASOLINA',
  'ETANOL',
  'DIESEL',
  'HIBRIDO',
  'ELETRICO',
  'GNV',
]

export const FUEL_BADGE_FIXTURES = [
  { fuelType: 'FLEX' as FuelType, label: 'Flex' },
  { fuelType: 'GASOLINA' as FuelType, label: 'Gasolina' },
  { fuelType: 'ETANOL' as FuelType, label: 'Etanol' },
  { fuelType: 'DIESEL' as FuelType, label: 'Diesel' },
  { fuelType: 'HIBRIDO' as FuelType, label: 'Híbrido' },
  { fuelType: 'ELETRICO' as FuelType, label: 'Elétrico' },
  { fuelType: 'GNV' as FuelType, label: 'GNV' },
]

export const VALID_ADDRESS_INPUT = {
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '123',
  neighborhood: 'Sé',
  city: 'São Paulo',
  state: 'SP',
}

export const VALID_DEALER_INPUT = {
  corporateName: 'Auto Sul Distribuidora LTDA',
  cnpj: '11.222.333/0001-81',
  address: {
    zipCode: '01001-000',
    street: 'Praça da Sé',
    number: '123',
    complement: 'Sala 4',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
  },
}

export const VALID_VEHICLE_INPUT = {
  brand: 'Toyota',
  model: 'Corolla Altis Hybrid',
  fuelType: 'HIBRIDO' as FuelType,
  color: 'Branco Pérola',
  manufactureYear: 2024,
  chassis: '9BWZZZ377VT004251',
  price: 185000.5,
  externalColor: 'Pérola',
  dealerId: 1,
}
