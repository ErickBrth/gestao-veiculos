export function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)

  let masked = digits.slice(0, 2)
  if (digits.length > 2) masked += `.${digits.slice(2, 5)}`
  if (digits.length > 5) masked += `.${digits.slice(5, 8)}`
  if (digits.length > 8) masked += `/${digits.slice(8, 12)}`
  if (digits.length > 12) masked += `-${digits.slice(12, 14)}`
  return masked
}

export function maskZipCode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function maskState(value: string): string {
  return value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}