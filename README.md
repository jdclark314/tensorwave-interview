# TensorWave Stock Watchlist

An interview-ready Next.js 16 project that showcases a curated market watchlist and linked detail views driven by Alpha Vantage fundamentals and daily price data.

## What this project does
- Watchlist of 15 large-cap tickers with logos and quick links to `/stocks/[symbol]` detail pages
- Company overview cards (asset type, exchange, sector, industry, market cap) pulled from the Alpha Vantage Overview endpoint
- Historical price view with an interactive SVG line/area chart plus daily close, volume, and % change table
- Mobile-friendly cards and desktop tables with a modern slate/indigo UI
- Sensible fallbacks when API data is missing, and daily revalidation aligned to NYSE midnight

## Requirements
- Node.js 18+ and pnpm (or your preferred npm client)
- Alpha Vantage API key available in `.env.local` as `ALPHAVANTAGE_API_KEY=your_key`

## Running locally
1) Install dependencies: `pnpm install`
2) Create `.env.local` with `ALPHAVANTAGE_API_KEY=your_key`
3) Start the dev server: `pnpm dev` then open http://localhost:3000

The homepage watchlist works without a key, but detail pages need the Alpha Vantage key to render company info and price history.

## Project layout
- `src/app/page.tsx`: Watchlist landing page
- `src/app/stocks/[symbol]/page.tsx`: Stock detail route
- `src/components/PriceChart.tsx`: Interactive price chart used on detail pages
- `src/lib/alphavantage.ts`: Data fetching and daily revalidation helper
- `src/lib/logos.ts`: Clearbit logo mapping for tickers
