import { z } from 'zod'

const MAX_PRICE = 9_999_999_999.99

const optionalNumber = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    schema.nullable().optional()
  )

export const vehicleSchema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória').max(80, 'Máximo 80 caracteres'),
  model: z.string().min(1, 'Modelo é obrigatório').max(80, 'Máximo 80 caracteres'),
  fuelType: z.enum(['FLEX', 'GASOLINA', 'ETANOL', 'DIESEL', 'HIBRIDO', 'ELETRICO', 'GNV'], {
    message: 'Tipo de combustível é obrigatório',
  }),
  color: z.string().min(1, 'Cor é obrigatória').max(40, 'Máximo 40 caracteres'),
  manufactureYear: optionalNumber(
    z
      .number()
      .int('Ano deve ser um número inteiro')
      .min(1900, 'Ano deve ser entre 1900 e 2100')
      .max(2100, 'Ano deve ser entre 1900 e 2100')
  ),
  chassis: z
    .string()
    .transform((val) => (val ? val.trim().toUpperCase() : ''))
    .refine(
      (val) => val === '' || /^[A-HJ-NPR-Z0-9]{17}$/.test(val),
      'Chassi deve ter 17 caracteres válidos'
    )
    .optional()
    .nullable(),
  price: optionalNumber(
    z
      .number()
      .positive('Preço deve ser maior que zero')
      .max(MAX_PRICE, 'Preço excede o valor máximo permitido')
      .refine(
        (val) => Math.round(val * 100) / 100 === val,
        'Preço deve ter no máximo 2 casas decimais'
      )
  ),
  externalColor: z.string().max(40, 'Máximo 40 caracteres').optional().nullable(),
  dealerId: optionalNumber(z.number().int().positive()),
})

export type VehicleFormInput = z.input<typeof vehicleSchema>
export type VehicleFormData = z.infer<typeof vehicleSchema>