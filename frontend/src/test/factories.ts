import type { DealerResponse, VehicleResponse, Address, ProblemDetail, AddressLookupResponse } from '../types'

export const addressFactory = {
  build: (overrides?: Partial<Address>): Address => ({
    zipCode: '01001000',
    street: 'Praça da Sé',
    number: '100',
    complement: 'lado ímpar',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    ...overrides,
  }),

  buildMinimal: (overrides?: Partial<Address>): Address => ({
    zipCode: '58400000',
    street: '',
    number: '',
    complement: null,
    neighborhood: '',
    city: 'Campina Grande',
    state: 'PB',
    ...overrides,
  }),
}

export const addressLookupFactory = {
  build: (overrides?: Partial<AddressLookupResponse>): AddressLookupResponse => ({
    zipCode: '01001000',
    street: 'Praça da Sé',
    complement: 'lado ímpar',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    ...overrides,
  }),
}

export const dealerFactory = {
  build: (overrides?: Partial<DealerResponse>): DealerResponse => ({
    id: 1,
    corporateName: 'Concessionária Norte LTDA',
    cnpj: '12345678000195',
    address: addressFactory.build(overrides?.address),
    ...overrides,
  }),

  buildList: (count: number): DealerResponse[] =>
    Array.from({ length: count }, (_, idx) =>
      dealerFactory.build({
        id: idx + 1,
        corporateName: `Concessionária ${idx + 1} LTDA`,
        cnpj: idx === 0 ? '12345678000195' : '11222333000181',
      })
    ),
}

export const vehicleFactory = {
  build: (overrides?: Partial<VehicleResponse>): VehicleResponse => ({
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    fuelType: 'FLEX',
    color: 'Prata',
    manufactureYear: 2024,
    chassis: '9BWZZZ377VT004251',
    price: 145000.0,
    externalColor: null,
    dealer: { id: 1, corporateName: 'Concessionária Norte LTDA' },
    ...overrides,
  }),

  buildUnassigned: (overrides?: Partial<VehicleResponse>): VehicleResponse =>
    vehicleFactory.build({
      id: 2,
      brand: 'Honda',
      model: 'City',
      fuelType: 'FLEX',
      color: 'Branco',
      manufactureYear: 2025,
      chassis: '93HGM6670RZ100005',
      price: 132000.0,
      externalColor: null,
      dealer: null,
      ...overrides,
    }),

  buildList: (count: number): VehicleResponse[] =>
    Array.from({ length: count }, (_, idx) =>
      vehicleFactory.build({
        id: idx + 1,
        brand: idx % 2 === 0 ? 'Toyota' : 'Volkswagen',
        model: idx % 2 === 0 ? `Corolla ${idx}` : `Polo ${idx}`,
        dealer: idx % 2 === 0 ? { id: 1, corporateName: 'Concessionária Norte LTDA' } : null,
      })
    ),
}

export const problemDetailFactory = {
  buildValidation: (errors: Record<string, string>): ProblemDetail => ({
    type: 'about:blank',
    title: 'Erro de validação',
    status: 422,
    detail: 'Um ou mais campos são inválidos',
    errors,
  }),

  buildConflict: (detail = 'Já existe um registro com estes dados'): ProblemDetail => ({
    type: 'about:blank',
    title: 'Regra de negócio violada',
    status: 409,
    detail,
  }),

  buildNotFound: (detail = 'Recurso não encontrado'): ProblemDetail => ({
    type: 'about:blank',
    title: 'Recurso não encontrado',
    status: 404,
    detail,
  }),

  buildServerError: (): ProblemDetail => ({
    type: 'about:blank',
    title: 'Erro interno do servidor',
    status: 500,
  }),
}
