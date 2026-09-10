import type { FuelType } from '../../types'
import type { BadgeProps } from './types'

export const FUEL_BADGE_CONFIG: Record<FuelType, { label: string; variant: NonNullable<BadgeProps['variant']> }> = {
  FLEX: { label: 'Flex', variant: 'default' },
  GASOLINA: { label: 'Gasolina', variant: 'default' },
  ETANOL: { label: 'Etanol', variant: 'default' },
  DIESEL: { label: 'Diesel', variant: 'default' },
  HIBRIDO: { label: 'Híbrido', variant: 'info' },
  ELETRICO: { label: 'Elétrico', variant: 'success' },
  GNV: { label: 'GNV', variant: 'default' },
}
