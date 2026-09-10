import { describe, it, expect } from 'vitest'
import { vehicleSchema } from '../schemas/vehicleSchema'

describe('vehicleSchema validation', () => {
  it('validates a complete vehicle correctly', () => {
    const validVehicle = {
      brand: 'Toyota',
      model: 'Corolla Altis Hybrid',
      fuelType: 'HIBRIDO',
      color: 'Branco Pérola',
      manufactureYear: 2024,
      chassis: '9BWZZZ377VT004251',
      price: 185000.5,
      externalColor: 'Pérola',
      dealerId: 1,
    }

    const result = vehicleSchema.safeParse(validVehicle)
    expect(result.success).toBe(true)
  })

  it('validates a minimal vehicle with optional fields null or empty', () => {
    const minimalVehicle = {
      brand: 'Volkswagen',
      model: 'Polo Track',
      fuelType: 'FLEX',
      color: 'Preto Ninja',
      manufactureYear: null,
      chassis: '',
      price: null,
      externalColor: null,
      dealerId: null,
    }

    const result = vehicleSchema.safeParse(minimalVehicle)
    expect(result.success).toBe(true)
  })

  it('rejects invalid fuelType', () => {
    const invalidFuel = {
      brand: 'Toyota',
      model: 'Yaris',
      fuelType: 'SOLAR' as unknown as 'FLEX',
      color: 'Prata',
    }

    const result = vehicleSchema.safeParse(invalidFuel)
    expect(result.success).toBe(false)
  })

  it('rejects invalid chassis formats', () => {
    const badChassis = {
      brand: 'Toyota',
      model: 'Yaris',
      fuelType: 'FLEX',
      color: 'Prata',
      chassis: 'INVALID_CHASSIS_123', // contains _ and length != 17
    }

    const result = vehicleSchema.safeParse(badChassis)
    expect(result.success).toBe(false)
  })

  it('rejects negative or zero price', () => {
    const negativePrice = {
      brand: 'Toyota',
      model: 'Yaris',
      fuelType: 'FLEX',
      color: 'Prata',
      price: -100,
    }

    const result = vehicleSchema.safeParse(negativePrice)
    expect(result.success).toBe(false)
  })
})
