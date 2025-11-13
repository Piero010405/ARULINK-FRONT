import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nowISO = () => new Date().toISOString();

export const makeResponse = (status: string, message: string, eventType?: string) => ({
  status,
  message,
  event_type: eventType,
  timestamp: nowISO(),
});
