#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps set up environment variables in Vercel
# 
# Usage:
#   chmod +x vercel-env-setup.sh
#   ./vercel-env-setup.sh
#
# Note: You'll need Vercel CLI installed: npm install -g vercel

set -e

echo "🔐 Keepers Auction - Vercel Environment Setup"
echo "=========================================="
echo ""
echo "This script will guide you through setting up environment variables."
echo "Make sure you have the Vercel CLI installed: npm install -g vercel"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "Select environment to configure:"
echo "1. Development (preview deployments)"
echo "2. Production (live site)"
read -p "Enter choice (1 or 2): " env_choice

if [ "$env_choice" = "1" ]; then
    SCOPE="preview"
    echo ""
    echo "📝 DEVELOPMENT SETUP (Test Keys)"
    echo "Get test keys from: https://dashboard.stripe.com/test/apikeys"
    echo ""
    read -p "Enter Stripe Test Publishable Key (pk_test_...): " stripe_test_key
    read -p "Enter Backend API URL (e.g., http://localhost:3000): " backend_api
    
    vercel env add VITE_STRIPE_PUBLISHABLE_KEY $stripe_test_key --scope=$SCOPE
    vercel env add VITE_BACKEND_API $backend_api --scope=$SCOPE
    vercel env add VITE_APP_ENV development --scope=$SCOPE
    vercel env add VITE_ENABLE_PAYMENTS true --scope=$SCOPE
    
elif [ "$env_choice" = "2" ]; then
    SCOPE="production"
    echo ""
    echo "🔴 PRODUCTION SETUP (Live Keys)"
    echo "Get live keys from: https://dashboard.stripe.com/apikeys"
    echo ""
    echo "⚠️  WARNING: You're about to set PRODUCTION environment variables."
    echo "   Make sure you have live Stripe keys ready."
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi
    
    read -p "Enter Stripe Live Publishable Key (pk_live_...): " stripe_live_key
    read -p "Enter Backend API URL (https://api.keepersauction.com): " backend_api
    
    vercel env add VITE_STRIPE_PUBLISHABLE_KEY $stripe_live_key --scope=$SCOPE
    vercel env add VITE_BACKEND_API $backend_api --scope=$SCOPE
    vercel env add VITE_APP_ENV production --scope=$SCOPE
    vercel env add VITE_ENABLE_PAYMENTS true --scope=$SCOPE
    vercel env add VITE_ENABLE_ADMIN_CONTROLS true --scope=$SCOPE
    vercel env add VITE_ENABLE_LIVE_STREAMING true --scope=$SCOPE
    
    echo ""
    echo "✅ Production environment variables set!"
    echo ""
    echo "Next steps:"
    echo "1. Set up Stripe webhooks: https://dashboard.stripe.com/webhooks"
    echo "2. Configure webhook endpoint: https://api.keepersauction.com/webhooks/stripe"
    echo "3. Deploy: vercel --prod"
else
    echo "Invalid choice."
    exit 1
fi

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "To view your settings:"
echo "  vercel env list"
echo ""
echo "To deploy:"
echo "  vercel            (preview)"
echo "  vercel --prod     (production)"
