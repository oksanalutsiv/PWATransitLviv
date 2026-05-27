/**
 * Payment simulation for demo/testing purposes.
 * Real card data is never stored — the simulation matches on the last 4 digits
 * of the saved payment method label.
 *
 * Test cards:
 *   4242 4242 4242 4242  →  Success
 *   5555 5555 5555 4444  →  Success
 *   4000 0000 0000 0002  →  Card declined
 *   4000 0000 0000 9995  →  Insufficient funds
 *   4000 0000 0000 0069  →  Expired card
 *   Any other valid 16-digit number  →  Success
 */

export type PaymentResult =
  | { ok: true }
  | { ok: false; reason: string }

// Keyed by last 4 digits of card number
const DECLINE_MAP: Record<string, string> = {
  '0002': 'Картку відхилено. Зверніться до банку.',
  '9995': 'Недостатньо коштів на картці.',
  '0069': 'Термін дії картки минув.',
}

/**
 * Returns a fake async payment result after a short simulated delay.
 * Pass the last 4 digits extracted from the saved payment method label.
 */
export const simulatePayment = (last4: string): Promise<PaymentResult> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const reason = DECLINE_MAP[last4]
      resolve(reason ? { ok: false, reason } : { ok: true })
    }, 900) // ~0.9 s "processing" feel
  )

/** Extracts last 4 digits from a label like "Карта ···4242" or "•••• 4242" */
export const extractLast4 = (label: string): string =>
  label.replace(/\s/g, '').slice(-4)

/** List of test cards shown as hints in the add-card form */
export const TEST_CARDS: { number: string; label: string; outcome: 'success' | 'decline' }[] = [
  { number: '4242 4242 4242 4242', label: 'Успішна оплата', outcome: 'success' },
  { number: '5555 5555 5555 4444', label: 'Успішна оплата', outcome: 'success' },
  { number: '4000 0000 0000 0002', label: 'Картку відхилено', outcome: 'decline' },
  { number: '4000 0000 0000 9995', label: 'Недостатньо коштів', outcome: 'decline' },
  { number: '4000 0000 0000 0069', label: 'Термін дії минув', outcome: 'decline' },
]
