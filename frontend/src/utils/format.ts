export function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 14) return value
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export function formatZipCode(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 8) return value
  return digits.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const num = typeof value === 'string' ? Number(value) : value
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}
