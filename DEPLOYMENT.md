# Deployment Guide for Keepers Auction

## Quick Start

This site is configured for Vercel deployment with security-first approach.

## Prerequisites

✅ Vercel account (free)
✅ GitHub account with this repo
✅ Stripe account (free)
✅ GoDaddy domain (keepersauction.com)

## Step 1: Connect to Vercel

1. Go to https://vercel.com/import
2. Import this repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 2: Set Environment Variables in Vercel

**Production Environment:**
1. Go to Project Settings → Environment Variables
2. Add these variables (get values from Stripe live mode):

   | Name | Value | Scope |
   |------|-------|-------|
   | `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxxxx` | Production |
   | `VITE_BACKEND_API` | `https://api.keepersauction.com` | Production |
   | `VITE_APP_ENV` | `production` | Production |
   | `VITE_ENABLE_PAYMENTS` | `true` | Production |
   | `VITE_ENABLE_ADMIN_CONTROLS` | `true` | Production |
   | `VITE_ENABLE_LIVE_STREAMING` | `true` | Production |

**Preview/Development:**
1. Add same variables with Scope: Preview
2. Use Stripe test keys (pk_test_xxxxx)

## Step 3: Configure Domain in Vercel

1. Go to Project Settings → Domains
2. Add: `keepersauction.com`
3. Choose: "Using external nameservers"
4. Vercel will give you nameserver details

## Step 4: Update GoDaddy DNS

1. Log in to GoDaddy
2. Go to: Domains → keepersauction.com → DNS
3. Update nameservers to Vercel's values
4. OR add CNAME record:
   - Host: `@` (or leave blank)
   - Value: `cname.vercel-dns.com`
5. Wait 24-48 hours for DNS propagation

## Step 5: Configure Stripe for Production

### Test Mode (Development)
1. Stripe Dashboard → API Keys (Test Mode toggle ON)
2. Copy "Publishable key" (pk_test_...)
3. Add to Vercel Preview environment variables
4. Test token purchases with test cards:
   - Card: `4242 4242 4242 4242`
   - Date: Any future date
   - CVC: Any 3 digits

### Live Mode (Production)
1. Stripe Dashboard → API Keys (Live Mode toggle)
2. Copy "Publishable key" (pk_live_...)
3. Add to Vercel Production environment variables
4. **DO NOT** add Secret Key to frontend

## Step 6: Set Up Stripe Webhooks

1. Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://api.keepersauction.com/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy "Signing secret" (whsec_...)
6. Add to backend environment variables (NEVER frontend)

## Step 7: HTTPS & Security

✅ Vercel auto-provisions SSL certificates
✅ HTTPS enforced automatically
✅ GoDaddy security certificates not needed (Vercel handles this)

## Step 8: Test Production

1. Visit: https://keepersauction.com
2. Navigate to Wallet/Token purchase
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify:
   - Payment processes
   - Tokens are awarded
   - No errors in Vercel logs
5. Check Stripe Dashboard → Payments for test transaction

## Step 9: Enable Features

### Admin Controls
Update `launch-guard-v2.js` to allow `/admin` routes:
```javascript
// CHANGE THIS:
if (routeStartsWith(ADMIN_PATHS)) {
  history.replaceState({}, '', '/#/')
  showNotice('Admin locked...')
}

// TO THIS (require real auth):
if (routeStartsWith(ADMIN_PATHS)) {
  const isAdmin = localStorage.getItem('user_is_admin') // Replace with real auth
  if (!isAdmin) {
    history.replaceState({}, '', '/#/')
    showNotice('Admin requires authentication')
  }
}
```

### Live Streaming
Connect your RTMP server:
1. Set `VITE_ENABLE_LIVE_STREAMING=true`
2. Configure backend to receive RTMP streams
3. Update HostRoom3D component with stream endpoint

## Monitoring

### Vercel Dashboard
- Analytics → Overview: Monitor page performance
- Deployments: Track each deployment
- Functions: Monitor serverless function usage
- Logs: Real-time error logs

### Stripe Dashboard
- Payments: All transactions
- Webhooks: Delivery status
- Test Data: No test charges appear in reports

## Rollback Process

If production breaks:
1. Vercel → Deployments → Click previous working deployment → Click "Redeploy"
2. This restores previous code without new commit

## Troubleshooting

### DNS Not Resolving
- Wait up to 48 hours for DNS propagation
- Check GoDaddy nameserver settings
- Verify Vercel domain shows as "Active"

### Payments Not Working
- Check Stripe publishable key in Vercel env vars
- Verify using test key (pk_test_) in Preview
- Check browser console for Stripe.js errors
- Verify backend is running and receiving requests

### Stripe Webhook Failures
- Check webhook signing secret in backend
- Verify endpoint URL is correct
- Check backend logs for signature verification errors

### 404 on Admin Routes
- Check if `/admin` route is enabled in `launch-guard-v2.js`
- Verify user is authenticated
- Check browser console for route errors

## Going Live Checklist

- [ ] Domain pointing to Vercel
- [ ] HTTPS working (green padlock)
- [ ] Environment variables set in Vercel
- [ ] Stripe live keys configured
- [ ] Stripe webhooks configured
- [ ] Token purchase tested end-to-end
- [ ] Admin controls enabled with auth
- [ ] 3D saloon loading properly
- [ ] Avatar studio working
- [ ] Host application form saving data
- [ ] No console errors in production
- [ ] Vercel analytics configured
- [ ] Error tracking (Sentry) configured
- [ ] Repository is PRIVATE

## Support

For issues:
1. Check Vercel logs: Project → Deployments → Latest → Logs
2. Check browser console: F12 → Console tab
3. Check Stripe dashboard for transaction details
4. Contact Vercel support: https://vercel.com/support
