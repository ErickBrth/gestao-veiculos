import { z } from 'zod'
import { BRAZILIAN_STATES } from '../utils/brazilianStates'

function isValidCnpj(val: string): boolean {
  const digits = val.replace(/\D/g, '')
  if (digits.length !== 14) return false
  if (/^(\d)\1+$/.test(digits)) return false

  const calcDigit = (slice: string, weights: number[]) => {
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(slice.charAt(i), 10) * weights[i]
    }
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  if (calcDigit(digits, w1) !== parseInt(digits.charAt(12), 10)) return false
  return calcDigit(digits, w2) === parseInt(digits.charAt(13), 10)
}

export const addressSchema = z.object({
  zipCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .refine((val) => val.replace(/\D/g, '').length === 8, 'CEP deve conter 8 dígitos'),
  street: z.string().min(1, 'Logradouro é obrigatório').max(150),
  number: z.string().min(1, 'Número é obrigatório').max(20),
  complement: z.string().max(100).optional().nullable(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório').max(100),
  city: z.string().min(1, 'Cidade é obrigatória').max(100),
  state: z
    .string()
    .min(1, 'UF é obrigatória')
    .refine((val) => BRAZILIAN_STATES.some((uf) => uf.value === val), 'UF inválida'),
})

export const dealerSchema = z.object({
  corporateName: z
    .string()
    .min(1, 'Razão social é obrigatória')
    .max(150, 'Razão social deve ter no máximo 150 caracteres'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório').refine(isValidCnpj, 'CNPJ inválido'),
  address: addressSchema,
})

export type DealerFormData = z.infer<typeof dealerSchema>