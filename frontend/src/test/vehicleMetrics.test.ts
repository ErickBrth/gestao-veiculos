import { describe, it, expect } from 'vitest'
import {
  calculateTotalCatalogValue,
  buildDealerSelectOptions,
} from '../utils/vehicleMetrics'
import { dealerFactory, vehicleFactory } from './factories'

describe('calculateTotalCatalogValue', () => {
  it('returns 0 for an empty list', () => {
    expect(calculateTotalCatalogValue([])).toBe(0)
  })

  it('returns 0 for null or undefined', () => {
    expect(calculateTotalCatalogValue(null)).toBe(0)
    expect(calculateTotalCatalogValue(undefined)).toBe(0)
  })

  it('sums the price of every vehicle', () => {
    const vehicles = [
      vehicleFactory.build({ id: 1, price: 100_000 }),
      vehicleFactory.build({ id: 2, price: 45_500.5 }),
    ]
    expect(calculateTotalCatalogValue(vehicles)).toBe(145_500.5)
  })

  it('ignores vehicles without a price', () => {
    const vehicles = [
      vehicleFactory.build({ id: 1, price: 100_000 }),
      vehicleFactory.build({ id: 2, price: null }),
    ]
    expect(calculateTotalCatalogValue(vehicles)).toBe(100_000)
  })
})

describe('buildDealerSelectOptions', () => {
  it('always puts the placeholder first with an empty value', () => {
    const options = buildDealerSelectOptions([])
    expect(options).toHaveLength(1)
    expect(options[0].value).toBe('')
    expect(options[0].label).toContain('Estoque Central')
  })

  it('maps dealers to string values so the select can bind them', () => {
    const dealers = dealerFactory.buildList(2)
    const options = buildDealerSelectOptions(dealers)

    expect(options).toHaveLength(3)
    expect(options[1]).toEqual({
      value: '1',
      label: 'Concessionária 1 LTDA (ID: 1)',
    })
  })

  it('accepts a custom placeholder', () => {
    const options = buildDealerSelectOptions(null, 'Selecione...')
    expect(options[0].label).toBe('Selecione...')
  })
})