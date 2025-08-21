/**
 * A/B Testing Variant Assignment
 * 
 * Provides secure 50/50 variant assignment using crypto.getRandomValues()
 * instead of Math.random() for cryptographic security.
 */

export type DownsellVariant = 'A' | 'B';

/**
 * Assigns a variant using cryptographically secure random number generation
 * @returns 'A' or 'B' with equal probability
 */
export function assignVariant(): DownsellVariant {
  // Use crypto.getRandomValues for secure random generation
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  
  // Get a value between 0 and 1
  const randomValue = array[0] / (0xffffffff + 1);
  
  // 50/50 split
  return randomValue < 0.5 ? 'A' : 'B';
}

/**
 * Variant configuration for different flows
 */
export const VARIANT_CONFIG = {
  A: {
    name: 'No Downsell',
    description: 'Direct cancellation flow without downsell offer',
    showDownsellOffer: false
  },
  B: {
    name: 'Downsell Offer',
    description: 'Show $10 off downsell offer before cancellation',
    showDownsellOffer: true,
    discountAmount: 10
  }
} as const;

/**
 * Calculate downsell price based on current price
 */
export function calculateDownsellPrice(currentPrice: number): number {
  return Math.max(0, currentPrice - VARIANT_CONFIG.B.discountAmount);
}