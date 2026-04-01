/**
 * Client-side payment service.
 *
 * Stripe secret logic is intentionally NOT present here.
 * All Stripe operations that require the secret key are handled
 * server-side via Vercel Serverless Functions under /api/stripe/*.
 *
 * Use VITE_STRIPE_PUBLIC_KEY (public key only) for client-side
 * Stripe.js initialisation (e.g. loading Elements / Checkout).
 */

export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;

/**
 * Create a Stripe Checkout session for purchasing tokens.
 * Delegates to the /api/stripe/create-checkout-session serverless function.
 */
export async function createTokenCheckoutSession(params: {
  userId: string;
  tokenAmount: number;
  priceId?: string;
}): Promise<{ url: string }> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message ?? 'Failed to create checkout session');
  }

  return response.json() as Promise<{ url: string }>;
}
