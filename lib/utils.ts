import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString?: string): string {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length !== 3) return dateString

  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  if (isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
