# Security Configuration Guide

## Overview

Keepers Auction is a token-based auction platform with Stripe payment integration. This guide ensures secure deployment and runtime security.

## Environment Variables

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your development keys (test keys from Stripe):
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   VITE_BACKEND_API=http://localhost:3000
   ```

3. **Never commit `.env.local`** — it's in `.gitignore`

### Production Deployment (Vercel)

1. **Never hardcode secrets in code**
2. Use Vercel's Environment Variables:
   - Go to: Project Settings → Environment Variables
   - Add each variable with scope: Production
   - Sensitive vars: Stripe keys, API endpoints, tokens

3. Set variables per environment:
   ```
   Development:  VITE_STRIPE_PUBLISHABLE_KEY = pk_test_xxxxx
   Preview:      VITE_STRIPE_PUBLISHABLE_KEY = pk_test_xxxxx  
   Production:   VITE_STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx
   ```

## Stripe Setup

### Development
1. Create Stripe account: https://stripe.com
2. Go to API Keys page
3. Copy **Test Publishable Key** (pk_test_*)
4. Add to `.env.local`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   ```

### Production
1. In Stripe Dashboard, switch to **Live Mode**
2. Copy **Live Publishable Key** (pk_live_*)
3. Add to Vercel Production Environment Variables:
   - Name: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_live_xxxxx`
   - Scope: Production

**⚠️ IMPORTANT**: 
- Publishable keys are safe to expose in frontend code
- **Secret keys must NEVER be in frontend code** — keep them on backend only
- Rotate keys periodically via Stripe Dashboard

## API Backend Security

### Token Purchase Flow
1. **Client** → Stripe.js to collect payment method (no card data in your code)
2. **Client** → POST `/api/tokens/purchase` with payment intent ID
3. **Backend** → Verify with Stripe (using Secret Key)
4. **Backend** → Award tokens to user only after successful charge
5. **Backend** → Store transaction in database for audit

### Required Backend Validations
- ✅ Authenticate user before any purchase
- ✅ Verify payment with Stripe using Secret Key
- ✅ Validate token amount is within allowed ranges
- ✅ Check user hasn't double-purchased same transaction
- ✅ Log all financial transactions for audit trail
- ✅ Rate-limit purchase endpoints (max 5 req/minute per user)

## Hosting Configuration

### Vercel Security
1. **Repository Privacy**: Keep repo PRIVATE until launch (Settings → Visibility)
2. **Branch Protection**: Require reviews before merging to `main`
3. **Deployments**: Auto-deploy on main branch, manual for production
4. **Preview URLs**: Share with team, revoke after launch

### Vercel Environment Variables Priority
1. System Environment Variables (Vercel system)
2. Project Environment Variables (set in UI)
3. GitHub environment (not recommended for secrets)

**NEVER use GitHub Secrets for frontend variables** — they get baked into bundles.

## Code Review Checklist

Before deploying to production:
- [ ] No `pk_live_` keys in code
- [ ] No `sk_live_` keys anywhere
- [ ] No API URLs hardcoded (use env vars)
- [ ] `.env.local` not committed
- [ ] `launch-guard-v2.js` updated with real auth
- [ ] Backend payment validation is in place
- [ ] CORS configured for your domain only
- [ ] Rate limiting enabled on API routes
- [ ] Error messages don't leak sensitive info

## Monitoring & Alerts

1. **Stripe Webhooks**: 
   - Configure webhook endpoint in Stripe Dashboard
   - Listen for: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Validate webhook signature using Secret Key

2. **Vercel Analytics**:
   - Monitor deployment logs for errors
   - Check function execution time
   - Review environment variable access patterns

3. **Error Tracking**:
   - Set up Sentry or similar for runtime errors
   - Never log card data or auth tokens
   - Monitor for payment failures

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Test with Stripe test keys
- [ ] Test payment flow end-to-end
- [ ] Verify HTTPS enforced
- [ ] Check CSP headers in `vercel.json`
- [ ] Review code for hardcoded secrets

### Post-Deployment
- [ ] Verify environment variables loaded correctly
- [ ] Test token purchase flow in production
- [ ] Monitor Stripe dashboard for test transactions
- [ ] Check Vercel logs for errors
- [ ] Verify domain CNAME records set

## Incident Response

### If Keys Are Exposed
1. **Immediately rotate keys**:
   - Stripe: Dashboard → API Keys → Regenerate
   - GitHub: Settings → Personal Access Tokens → Delete compromised token
2. **Update Vercel Environment Variables** with new keys
3. **Audit logs**: Check Stripe for unauthorized transactions
4. **Notify users if necessary**: If PII was compromised

## References
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OWASP Security Best Practices](https://owasp.org)
- [Stripe Security Guidelines](https://stripe.com/docs/security)
