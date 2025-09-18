import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export function generateQRCodeData(restaurantSlug: string, tableNumber: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurantSlug}/${tableNumber}`;
}

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price));
}
