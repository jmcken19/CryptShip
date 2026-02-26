# Cryptship

**Shipping users to the blockchain — safely and confidently.**

Guided onboarding voyages for SOL, ETH, and BTC. Build wallet fundamentals, learn how to read the network, and move safely.

## Problem

People new to crypto often don't know where to start, which steps actually matter, or how to safely set up and fund a wallet without falling for common pitfalls.

## Solution

Cryptship guides users through simple, curated onboarding voyages for Solana (SOL), Ethereum (ETH), and Bitcoin (BTC). It helps new users set up and fund their first self-custody or exchange wallets so they can trade with more confidence and safety.

## Disclaimer

Cryptship does not provide trading or investment advice.
Cryptship is not financial advice.
Cryptship focuses on wallet setup and safe on-chain workflows so users have the freedom to trade on their own responsibility.

## Tech Stack

- **Next.js (App Router)** — Core framework and routing
- **React** — UI components and state management
- **Vanilla CSS** — Custom design system focused on a minimal ocean theme
- **Serverless API Routes** — Market data snapshot and news aggregation fallback system
- **LocalStorage** — Progress persistence and device preferences (no database required)

## How It Works

- **Market Data**: Spot prices and headlines are fetched via `/api/*` endpoints with primary/fallback provider logic and client-side caching to maintain freshness while respecting rate limits.
- **Device Modes**: Users select between **Mobile**, **Web**, or **Both**. This filters the onboarding instructions and links to ensure relevance (e.g., App Store vs Browser Extension).
- **Voyages**: Each chain features a 6-waypoint voyage with a visual "Sea Route" rail, scrollspy navigation, auto-advance, and progress reset options.

## Local Development

### Quickstart

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local` with your own API keys if needed (defaults work for basic development).*

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open http://localhost:3000**

## Deployment

### Vercel

1. Import the GitHub repository into Vercel.
2. Set environment variables from your `.env.local` in the Vercel dashboard.
3. Deploy.
