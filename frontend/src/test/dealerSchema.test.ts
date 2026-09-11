import { describe, it, expect } from 'vitest'
import { dealerSchema, addressSchema } from '../schemas/dealerSchema'
import {
  VALID_CNPJS,
  INVALID_CNPJS,
  VALID_ADDRESS_INPUT,
  VALID_DEALER_INPUT,
} from './fixtures'

describe('CNPJ validation (dealerSchema)', () => {
  const baseValid = {
    corporateName: 'Auto Sul LTDA',
    address: VALID_ADDRESS_INPUT,
  }

  describe.each(VALID_CNPJS.map((cnpj) => ({ cnpj })))(
    'accepts $cnpj as valid',
    ({ cnpj }) => {
      it('parses successfully', () => {
        const result = dealerSchema.safeParse({ ...baseValid, cnpj })
        expect(result.success).toBe(true)
      })
    }
  )

  describe.each(INVALID_CNPJS.map((cnpj) => ({ cnpj })))(
    'rejects $cnpj as invalid',
    ({ cnpj }) => {
      it('returns a cnpj error', () => {
        const result = dealerSchema.safeParse({ ...baseValid, cnpj })
        expect(result.success).toBe(false)
        if (!result.success) {
          const paths = result.error.errors.map((e) => e.path.join('.'))
          expect(paths).toContain('cnpj')
        }
      })
    }
  )
})

describe('addressSchema', () => {
  it('accepts a complete, valid address', () => {
    const result = addressSchema.safeParse({ ...VALID_ADDRESS_INPUT, complement: 'Sala 4' })
    expect(result.success).toBe(true)
  })

  it('accepts address without optional complement', () => {
    const result = addressSchema.safeParse(VALID_ADDRESS_INPUT)
    expect(result.success).toBe(true)
  })

  it('accepts formatted CEP with hyphen', () => {
    const result = addressSchema.safeParse({ ...VALID_ADDRESS_INPUT, zipCode: '01001-000' })
    expect(result.success).toBe(true)
  })

  it('rejects CEP with fewer than 8 digits', () => {
    const result = addressSchema.safeParse({ ...VALID_ADDRESS_INPUT, zipCode: '12345' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('CEP deve conter 8 dígitos')
    }
  })

  it('normalises state to uppercase', () => {
    const result = addressSchema.safeParse({ ...VALID_ADDRESS_INPUT, state: 'sp' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.state).toBe('SP')
    }
  })

  it('rejects state with more than 2 characters', () => {
    const result = addressSchema.safeParse({ ...VALID_ADDRESS_INPUT, state: 'SPO' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('UF inválida')
    }
  })

  it('rejects empty required fields and reports each path', () => {
    const result = addressSchema.safeParse({
      zipCode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: 'SP',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path.join('.'))
      expect(paths).toContain('zipCode')
      expect(paths).toContain('street')
      expect(paths).toContain('number')
      expect(paths).toContain('neighborhood')
      expect(paths).toContain('city')
    }
  })
})

describe('dealerSchema', () => {
  it('validates a complete, correct dealer object', () => {
    expect(dealerSchema.safeParse(VALID_DEALER_INPUT).success).toBe(true)
  })

  it('rejects empty corporateName', () => {
    const result = dealerSchema.safeParse({ ...VALID_DEALER_INPUT, corporateName: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Razão social é obrigatória')
    }
  })

  it('rejects corporateName longer than 150 characters', () => {
    const result = dealerSchema.safeParse({ ...VALID_DEALER_INPUT, corporateName: 'A'.repeat(151) })
    expect(result.success).toBe(false)
  })

  it('reports multiple independent errors in a single parse', () => {
    const result = dealerSchema.safeParse({
      corporateName: '',
      cnpj: '11111111111111',
      address: { ...VALID_DEALER_INPUT.address, zipCode: '123' },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.errors.map((e) => e.path.join('.'))
      expect(paths).toContain('corporateName')
      expect(paths).toContain('cnpj')
      expect(paths).toContain('address.zipCode')
    }
  })

  describe('dealerSchema — state', () => {
  it('accepts a valid two-letter state code', () => {
    const result = dealerSchema.safeParse({
      ...VALID_DEALER_INPUT,
      address: { ...VALID_DEALER_INPUT.address, state: 'PB' },
    })
    expect(result.success).toBe(true)
  })

  it('rejects a code that is not a real Brazilian state', () => {
    const result = dealerSchema.safeParse({
      ...VALID_DEALER_INPUT,
      address: { ...VALID_DEALER_INPUT.address, state: 'XX' },
    })
    expect(result.success).toBe(false)
  })
})

})
