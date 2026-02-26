# Cryptship.com

**Shipping users to the blockchain — safely and confidently.**

Guided onboarding voyages for SOL, ETH, and BTC. Build wallet fundamentals, learn how to read the network, and move safely.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your values (defaults work for dev)

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

## Tech Stack

- **Next.js 14** (App Router) — routing, SSR, API routes
- **React 18** — UI components
- **Chart.js** — price charts
- **SQLite** (better-sqlite3) — auth & progress persistence
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT session tokens
- **Vanilla CSS** — ocean-themed design system

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `cryptship-dev-secret-...` | Secret for JWT signing |
| `DATABASE_PATH` | `./cryptship.db` | Path to SQLite database |
| `COINGECKO_BASE_URL` | `https://api.coingecko.com/api/v3` | CoinGecko API base URL |

## Features

- **Market data** — live prices for BTC, ETH, SOL with 60s polling
  - *Dev test:* `curl http://localhost:3000/api/market-snapshot`
  - *Dev test:* `curl http://localhost:3000/api/news?scope=global`
- **Price charts** — 24H / 7D / 30D / 1Y toggleable line charts
- **Quick analytics** — chain-specific metrics (gas, fees, mempool)
- **Onboarding voyages** — 8 waypoints per chain with scrollspy rail
- **Auth** — email + password registration and login
- **Progress tracking** — persisted per chain, per waypoint
- **Responsive** — mobile-first design
- **Ocean theme** — animated gradient background, wave effects

## Project Structure

```
app/                    # Next.js App Router pages
├── api/                # API routes (market, auth, progress)
├── sol/eth/btc/        # Chain pages
├── signin/             # Auth page
├── disclaimer/         # Legal page
components/             # React components
context/                # Auth context
data/                   # Config, waypoints, headlines
lib/                    # Database setup
```

## Deployment

Build for production:
```bash
npm run build
npm start
```

> **Note:** `better-sqlite3` requires native compilation. For serverless platforms, consider switching to a cloud database.

## Deploy to Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform.

1. **Import your GitHub repo into Vercel.**
2. **Set environment variables from `.env.example`** in the Vercel dashboard.
3. **Deploy** your project.

## License

Educational project. Not financial advice.
