import { z } from 'zod'

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

  const d1 = calcDigit(digits, w1)
  if (d1 !== parseInt(digits.charAt(12), 10)) return false

  const d2 = calcDigit(digits, w2)
  return d2 === parseInt(digits.charAt(13), 10)
}

export const addressSchema = z.object({
  zipCode: z
    .string()
    .min(1, 'CEP é obrigatório')
    .refine((val) => val.replace(/\D/g, '').length === 8, 'CEP deve conter 8 dígitos'),
  street: z.string().min(1, 'Logradouro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z
    .string()
    .min(2, 'UF inválida')
    .max(2, 'UF deve ter 2 letras')
    .toUpperCase(),
})

export const dealerSchema = z.object({
  corporateName: z
    .string()
    .min(1, 'Razão social é obrigatória')
    .max(150, 'Razão social deve ter no máximo 150 caracteres'),
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .refine(isValidCnpj, 'CNPJ inválido'),
  address: addressSchema,
})

export type DealerFormData = z.infer<typeof dealerSchema>
