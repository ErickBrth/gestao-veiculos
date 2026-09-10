import { describe, it, expect } from 'vitest'
import { dealerSchema } from '../schemas/dealerSchema'

describe('dealerSchema and CNPJ validation', () => {
  it('validates a correct dealer with valid CNPJ and complete address', () => {
    const validData = {
      corporateName: 'Auto Sul Distribuidora de Veículos LTDA',
      cnpj: '11.222.333/0001-81', // valid formatted CNPJ
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

    const result = dealerSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects invalid CNPJ check digits', () => {
    const invalidData = {
      corporateName: 'Auto Sul',
      cnpj: '11.222.333/0001-82', // invalid check digit
      address: {
        zipCode: '01001000',
        street: 'Rua A',
        number: '1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
      },
    }

    const result = dealerSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errorPaths = result.error.errors.map((e) => e.path.join('.'))
      expect(errorPaths).toContain('cnpj')
      expect(result.error.errors[0].message).toBe('CNPJ inválido')
    }
  })

  it('rejects repeated digits CNPJ', () => {
    const repeated = {
      corporateName: 'Auto Sul',
      cnpj: '11111111111111',
      address: {
        zipCode: '01001000',
        street: 'Rua A',
        number: '1',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
      },
    }

    const result = dealerSchema.safeParse(repeated)
    expect(result.success).toBe(false)
  })

  it('rejects missing corporateName and invalid address state', () => {
    const data = {
      corporateName: '',
      cnpj: '11.222.333/0001-81',
      address: {
        zipCode: '123',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: 'SPO', // more than 2 chars
      },
    }

    const result = dealerSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errorMap = Object.fromEntries(
        result.error.errors.map((e) => [e.path.join('.'), e.message])
      )
      expect(errorMap['corporateName']).toBe('Razão social é obrigatória')
      expect(errorMap['address.zipCode']).toBe('CEP deve conter 8 dígitos')
      expect(errorMap['address.street']).toBe('Logradouro é obrigatório')
      expect(errorMap['address.state']).toBe('UF deve ter 2 letras')
    }
  })
})
