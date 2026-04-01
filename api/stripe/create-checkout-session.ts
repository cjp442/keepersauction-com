import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { userId, tokenAmount, priceId } = req.body as {
    userId?: string
    tokenAmount?: number
    priceId?: string
  }

  if (!userId || !tokenAmount) {
    return res.status(400).json({ message: 'userId and tokenAmount are required' })
  }

  try {
    // Use a provided priceId or fall back to the env-configured default
    const resolvedPriceId = priceId ?? process.env.STRIPE_TOKEN_PRICE_ID

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: resolvedPriceId
        ? [{ price: resolvedPriceId, quantity: tokenAmount }]
        : [
            {
              price_data: {
                currency: 'usd',
                product_data: { name: `${tokenAmount} Keeper Tokens` },
                // 100 tokens = $1.00 (1 cent per token)
                unit_amount: 1,
              },
              quantity: tokenAmount,
            },
          ],
      metadata: {
        userId,
        tokenAmount: String(tokenAmount),
      },
      success_url: `${process.env.VITE_DOMAIN ?? 'https://keepersauction.com'}/tokens?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_DOMAIN ?? 'https://keepersauction.com'}/tokens?cancelled=1`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return res.status(500).json({ message })
  }
}
