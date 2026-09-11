import { describe, it, expect } from 'vitest'
import { vehicleSchema } from '../schemas/vehicleSchema'
import {
  VALID_CHASSIS,
  INVALID_CHASSIS,
  VALID_FUEL_TYPES,
  VALID_VEHICLE_INPUT,
} from './fixtures'
import type { FuelType } from '../types'

describe('vehicleSchema — chassis validation', () => {
  const baseValid = {
    brand: 'Toyota',
    model: 'Yaris',
    fuelType: 'FLEX' as FuelType,
    color: 'Prata',
  }

  it('accepts empty string chassis', () => {
    const result = vehicleSchema.safeParse({ ...baseValid, chassis: '' })
    expect(result.success).toBe(true)
  })

  it('accepts null chassis', () => {
    const result = vehicleSchema.safeParse({ ...baseValid, chassis: null })
    expect(result.success).toBe(true)
  })

  describe.each(VALID_CHASSIS.map((chassis) => ({ chassis })))(
    'accepts $chassis as a valid VIN',
    ({ chassis }) => {
      it('parses successfully', () => {
        const result = vehicleSchema.safeParse({ ...baseValid, chassis })
        expect(result.success).toBe(true)
      })
    }
  )

  describe.each(INVALID_CHASSIS.map((chassis) => ({ chassis })))(
    'rejects $chassis',
    ({ chassis }) => {
      it('returns a chassis error', () => {
        const result = vehicleSchema.safeParse({ ...baseValid, chassis })
        expect(result.success).toBe(false)
        if (!result.success) {
          const paths = result.error.errors.map((e) => e.path.join('.'))
          expect(paths).toContain('chassis')
        }
      })
    }
  )

  it('normalises chassis to uppercase before validation', () => {
    const result = vehicleSchema.safeParse({ ...baseValid, chassis: '9bwzzz377vt004251' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.chassis).toBe('9BWZZZ377VT004251')
    }
  })
})

describe('vehicleSchema — fuelType validation', () => {
  const base = { brand: 'Toyota', model: 'Yaris', color: 'Prata' }

  describe.each(VALID_FUEL_TYPES.map((fuelType) => ({ fuelType })))(
    'accepts $fuelType',
    ({ fuelType }) => {
      it('parses successfully', () => {
        expect(vehicleSchema.safeParse({ ...base, fuelType }).success).toBe(true)
      })
    }
  )

  it('rejects an unknown fuel type', () => {
    const result = vehicleSchema.safeParse({ ...base, fuelType: 'SOLAR' })
    expect(result.success).toBe(false)
  })

  it('rejects missing fuelType', () => {
    const result = vehicleSchema.safeParse(base)
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path.join('.'))
      expect(paths).toContain('fuelType')
    }
  })
})

describe('vehicleSchema — price validation', () => {
  const base = { brand: 'Toyota', model: 'Yaris', fuelType: 'FLEX' as const, color: 'Prata' }

  it('accepts a positive price', () => {
    expect(vehicleSchema.safeParse({ ...base, price: 89900 }).success).toBe(true)
  })

  it('accepts null price', () => {
    expect(vehicleSchema.safeParse({ ...base, price: null }).success).toBe(true)
  })

  it('accepts a price with two decimal places', () => {
    const result = vehicleSchema.safeParse({ ...VALID_VEHICLE_INPUT, price: 100.99 })
    expect(result.success).toBe(true)
  })

  it('accepts other floating point edge cases with cents', () => {
    for (const price of [0.01, 1.99, 149_900.29, 8.07]) {
      expect(vehicleSchema.safeParse({ ...VALID_VEHICLE_INPUT, price }).success).toBe(true)
    }
  })

  it('accepts empty string price', () => {
    expect(vehicleSchema.safeParse({ ...base, price: '' }).success).toBe(true)
  })

  it('rejects zero price', () => {
    const result = vehicleSchema.safeParse({ ...base, price: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = vehicleSchema.safeParse({ ...base, price: -100 })
    expect(result.success).toBe(false)
  })
})

describe('vehicleSchema — manufactureYear validation', () => {
  const base = { brand: 'Toyota', model: 'Yaris', fuelType: 'FLEX' as FuelType, color: 'Prata' }

  it('accepts a year within valid range', () => {
    expect(vehicleSchema.safeParse({ ...base, manufactureYear: 2024 }).success).toBe(true)
  })

  it('accepts null year', () => {
    expect(vehicleSchema.safeParse({ ...base, manufactureYear: null }).success).toBe(true)
  })

  it('rejects year before 1900', () => {
    expect(vehicleSchema.safeParse({ ...base, manufactureYear: 1899 }).success).toBe(false)
  })

  it('rejects year after 2100', () => {
    expect(vehicleSchema.safeParse({ ...base, manufactureYear: 2101 }).success).toBe(false)
  })
})

describe('vehicleSchema — full object', () => {
  it('validates a complete vehicle with all optional fields provided', () => {
    const result = vehicleSchema.safeParse(VALID_VEHICLE_INPUT)
    expect(result.success).toBe(true)
  })

  it('validates a minimal vehicle with only required fields', () => {
    const result = vehicleSchema.safeParse({
      brand: 'Volkswagen',
      model: 'Polo Track',
      fuelType: 'FLEX',
      color: 'Preto Ninja',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty required fields and reports all paths', () => {
    const result = vehicleSchema.safeParse({ brand: '', model: '', fuelType: 'FLEX', color: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path.join('.'))
      expect(paths).toContain('brand')
      expect(paths).toContain('model')
      expect(paths).toContain('color')
    }
  })
})

describe('vehicleSchema — price limits', () => {
  it('accepts the maximum value NUMERIC(12,2) can hold', () => {
    const result = vehicleSchema.safeParse({
      ...VALID_VEHICLE_INPUT,
      price: 9_999_999_999.99,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a price beyond the column capacity', () => {
    const result = vehicleSchema.safeParse({
      ...VALID_VEHICLE_INPUT,
      price: 99_999_999_999,
    })
    expect(result.success).toBe(false)
  })

  it('rejects more than two decimal places', () => {
    const result = vehicleSchema.safeParse({ ...VALID_VEHICLE_INPUT, price: 100.999 })
    expect(result.success).toBe(false)
  })
})

describe('vehicleSchema — manufactureYear', () => {
  it('rejects a fractional year', () => {
    const result = vehicleSchema.safeParse({
      ...VALID_VEHICLE_INPUT,
      manufactureYear: 2024.5,
    })
    expect(result.success).toBe(false)
  })
})

