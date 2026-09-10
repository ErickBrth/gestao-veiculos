import { z } from 'zod'

export const vehicleSchema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória').max(80, 'Máximo 80 caracteres'),
  model: z.string().min(1, 'Modelo é obrigatório').max(80, 'Máximo 80 caracteres'),
  fuelType: z.enum(['FLEX', 'GASOLINA', 'ETANOL', 'DIESEL', 'HIBRIDO', 'ELETRICO', 'GNV'], {
    message: 'Tipo de combustível é obrigatório',
  }),
  color: z.string().min(1, 'Cor é obrigatória').max(40, 'Máximo 40 caracteres'),
  manufactureYear: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z
        .number()
        .min(1900, 'Ano inválido')
        .max(2100, 'Ano inválido')
        .nullable()
        .optional()
    ),
  chassis: z
    .string()
    .transform((val) => (val ? val.trim().toUpperCase() : ''))
    .refine((val) => val === '' || /^[A-HJ-NPR-Z0-9]{17}$/.test(val), 'Chassi deve ter 17 caracteres válidos')
    .optional()
    .nullable(),
  price: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number().positive('Preço deve ser maior que zero').nullable().optional()
    ),
  externalColor: z.string().max(40, 'Máximo 40 caracteres').optional().nullable(),
  dealerId: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined || Number(val) === 0 ? null : Number(val)),
      z.number().nullable().optional()
    ),
})

export type VehicleFormInput = z.input<typeof vehicleSchema>
export type VehicleFormData = z.infer<typeof vehicleSchema>
