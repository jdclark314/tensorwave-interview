import Link from "next/link";

type Stock = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
};

const stocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", sector: "Semiconductors" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Class A)", exchange: "NASDAQ", sector: "Communication Services" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", sector: "Communication Services" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", sector: "Communication Services" },
  { symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ", sector: "Semiconductors" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", exchange: "NASDAQ", sector: "Semiconductors" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "MA", name: "Mastercard Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", exchange: "NYSE", sector: "Energy" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:py-16">
        <header className="flex flex-col gap-4">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-indigo-200 ring-1 ring-indigo-500/20">
            Watchlist preview
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Market pulse: 15 tickers to explore
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
            Static list for now; we&apos;ll wire AlphaVantage company overviews and prices next.
            Click any ticker to jump into its detail view.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4">
            <div className="text-sm text-slate-300">Click a ticker to open its detail page.</div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
              {stocks.length} tickers
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] divide-y divide-slate-800 text-sm sm:text-base">
              <thead className="bg-slate-900/60 text-slate-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Ticker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Exchange
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Sector
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="transition hover:bg-slate-800/60">
                    <td className="whitespace-nowrap px-6 py-4 font-semibold">
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="inline-flex items-center gap-2 text-indigo-200 hover:text-indigo-50"
                      >
                        <span>{stock.symbol}</span>
                        <span className="text-[11px] rounded-full bg-indigo-500/10 px-2 py-0.5 font-medium uppercase tracking-wide text-indigo-200 ring-1 ring-indigo-500/30">
                          Open
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-100">{stock.name}</td>
                    <td className="px-6 py-4 text-slate-300">{stock.exchange}</td>
                    <td className="px-6 py-4 text-slate-300">{stock.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-xs text-slate-400">
          You&apos;ll add your API key as ALPHAVANTAGE_API_KEY in .env.local; we&apos;ll plug that into real data next.
        </p>
      </div>
    </main>
  );
}
