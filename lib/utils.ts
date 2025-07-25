import { clsx, type ClassValue } from "clsx"

/**
 * Combina clases CSS usando clsx
 * @param inputs - Clases CSS a combinar
 * @returns String de clases CSS combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
