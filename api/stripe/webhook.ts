import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Service-role client (server-side only — never exposed to the browser)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export const config = {
  api: { bodyParser: false },
}

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    const rawBody = await getRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return res.status(400).json({ message })
  }

  // Only handle checkout.session.completed
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  const userId = session.metadata?.userId
  const tokenAmount = Number(session.metadata?.tokenAmount ?? 0)
  const stripeSessionId = session.id

  if (!userId || !tokenAmount) {
    return res.status(400).json({ message: 'Missing userId or tokenAmount in session metadata' })
  }

  // Idempotency: skip if this session was already processed
  const { data: existing } = await supabaseAdmin
    .from('stripe_events')
    .select('id')
    .eq('stripe_session_id', stripeSessionId)
    .single()

  if (existing) {
    return res.status(200).json({ received: true, duplicate: true })
  }

  // Credit tokens to the user's account
  const { error: txError } = await supabaseAdmin.from('coin_transactions').insert({
    user_id: userId,
    type: 'purchase',
    amount: tokenAmount,
    description: `Token purchase — Stripe session ${stripeSessionId}`,
  })

  if (txError) {
    return res.status(500).json({ message: txError.message })
  }

  // Upsert balance
  const { error: balanceError } = await supabaseAdmin.rpc('credit_tokens', {
    p_user_id: userId,
    p_amount: tokenAmount,
  })

  if (balanceError) {
    return res.status(500).json({ message: balanceError.message })
  }

  // Record the processed event for idempotency
  await supabaseAdmin.from('stripe_events').insert({
    stripe_session_id: stripeSessionId,
    user_id: userId,
    token_amount: tokenAmount,
  })

  return res.status(200).json({ received: true })
}
