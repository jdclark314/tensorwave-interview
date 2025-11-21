import Link from "next/link";
import Image from "next/image";

import { getLogoUrl } from "@/lib/logos";

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
            Market Pulse: 15 tickers to explore
          </h1>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-4">
            <div className="text-sm text-slate-300">Click a ticker to open its detail page.</div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
              {stocks.length} tickers
            </span>
          </div>
          <div className="grid gap-3 p-4 sm:hidden">
            {stocks.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 transition hover:border-indigo-500/50 hover:bg-slate-900/80"
              >
                <div className="flex items-center gap-3">
                  {getLogoUrl(stock.symbol) ? (
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-800 bg-slate-800/70">
                      <Image
                        src={getLogoUrl(stock.symbol) as string}
                        alt={`${stock.name} logo`}
                        fill
                        sizes="36px"
                        className="object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-800/70 text-xs font-semibold text-slate-200">
                      {stock.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-50">{stock.symbol}</span>
                      <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-200 ring-1 ring-indigo-500/30">
                        Open
                      </span>
                    </div>
                    <p className="text-sm text-slate-200">{stock.name}</p>
                    <p className="text-xs text-slate-400">
                      {stock.exchange} · {stock.sector}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-200">
                  Details →
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
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
                    <td className="px-6 py-4 text-slate-100">
                      <div className="flex items-center gap-3">
                        {getLogoUrl(stock.symbol) ? (
                          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-800 bg-slate-800/70">
                            <Image
                              src={getLogoUrl(stock.symbol) as string}
                              alt={`${stock.name} logo`}
                              fill
                              sizes="32px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-800/70 text-xs font-semibold text-slate-200">
                            {stock.symbol.slice(0, 2)}
                          </div>
                        )}
                        <span>{stock.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{stock.exchange}</td>
                    <td className="px-6 py-4 text-slate-300">{stock.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
