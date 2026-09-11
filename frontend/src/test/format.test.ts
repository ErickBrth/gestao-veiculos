import { describe, it, expect } from 'vitest'
import { maskCnpj, maskZipCode} from '../utils/format'

describe('maskCnpj', () => {
  it('builds the mask progressively while typing', () => {
    expect(maskCnpj('1')).toBe('1')
    expect(maskCnpj('123')).toBe('12.3')
    expect(maskCnpj('12345')).toBe('12.345')
    expect(maskCnpj('123456')).toBe('12.345.6')
    expect(maskCnpj('123456780')).toBe('12.345.678/0')
    expect(maskCnpj('123456780001')).toBe('12.345.678/0001')
    expect(maskCnpj('12345678000195')).toBe('12.345.678/0001-95')
  })

  it('discards non-digits and caps at 14 digits', () => {
    expect(maskCnpj('abc12def345')).toBe('12.345')
    expect(maskCnpj('123456780001959999')).toBe('12.345.678/0001-95')
  })

  it('is idempotent on an already masked value', () => {
    expect(maskCnpj('12.345.678/0001-95')).toBe('12.345.678/0001-95')
  })
})

describe('maskZipCode', () => {
  it('inserts the hyphen only after the fifth digit', () => {
    expect(maskZipCode('584')).toBe('584')
    expect(maskZipCode('58400')).toBe('58400')
    expect(maskZipCode('584000')).toBe('58400-0')
    expect(maskZipCode('58400000')).toBe('58400-000')
  })

  it('discards non-digits and caps at 8 digits', () => {
    expect(maskZipCode('58400-000999')).toBe('58400-000')
  })
})
