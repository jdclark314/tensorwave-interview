import Image from "next/image";
import Link from "next/link";

import { getCompanyOverview, getDailyPrices } from "@/lib/alphavantage";
import { getLogoUrl } from "@/lib/logos";
import { PriceChart } from "@/components/PriceChart";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function formatField(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "N/A";
  return typeof value === "number" ? value.toString() : value;
}

function formatMarketCap(value: string | number | null | undefined) {
  const numeric = typeof value === "number" ? value : value ? Number(value) : null;
  if (!Number.isFinite(numeric)) return "N/A";
  return currencyFormatter.format(numeric);
}

function formatChange(changePct: number | null) {
  if (changePct === null || !Number.isFinite(changePct)) return "N/A";
  const sign = changePct >= 0 ? "+" : "";
  return `${sign}${changePct.toFixed(2)}%`;
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-100 sm:text-base">
        {formatField(value)}
      </p>
    </div>
  );
}

export default async function StockDetailPage({ params }: StockPageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = decodeURIComponent(rawSymbol).toUpperCase();
  const [overview, prices] = await Promise.all([
    getCompanyOverview(symbol),
    getDailyPrices(symbol),
  ]);
  const logoUrl = getLogoUrl(symbol);

  const priceHistory = prices?.slice(0, 60) ?? [];
  const missingApiKey = !process.env.ALPHAVANTAGE_API_KEY;
  const chartPoints = priceHistory
    .filter((entry) => entry.close !== null)
    .map((entry) => ({
      date: entry.date,
      // non-null asserted because filtered
      close: entry.close as number,
    }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-12 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 transition hover:text-indigo-50"
        >
          <span aria-hidden>{"<-"}</span>
          Back to watchlist
        </Link>

        {missingApiKey && (
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
            Add your AlphaVantage key to <code className="rounded bg-amber-500/20 px-1">.env.local</code> as{" "}
            <code className="rounded bg-amber-500/20 px-1">ALPHAVANTAGE_API_KEY</code>, then restart the dev server.
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-slate-800 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-200">
                Company Overview
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {logoUrl ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
                    <Image
                      src={logoUrl}
                      alt={`${symbol} logo`}
                      fill
                      sizes="48px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-lg font-semibold text-slate-100">
                    {symbol.slice(0, 2)}
                  </div>
                )}
                <span className="rounded-lg bg-indigo-500/15 px-3 py-1 text-sm font-semibold text-indigo-100 ring-1 ring-indigo-500/30">
                  {symbol}
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">
                  {formatField(overview?.assetType)}
                </span>
              </div>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                {overview?.name ?? "N/A"}
              </h1>
              <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
                {overview?.description ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Symbol" value={symbol} />
            <DetailField label="Asset Type" value={overview?.assetType} />
            <DetailField label="Exchange" value={overview?.exchange} />
            <DetailField label="Sector" value={overview?.sector} />
            <DetailField label="Industry" value={overview?.industry} />
            <DetailField label="Market Cap" value={formatMarketCap(overview?.marketCap)} />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-indigo-500/10 backdrop-blur">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-200">
                Historical Prices (Daily)
              </p>
              <p className="text-sm text-slate-400">
                Close, volume, and % change vs. previous trading day. Showing up to 60 most recent.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
              {priceHistory.length} rows
            </span>
          </div>

          {priceHistory.length === 0 ? (
            <div className="px-6 py-8 text-sm text-slate-300">
              No historical prices available yet.{" "}
              {missingApiKey
                ? "Add your API key to load data."
                : "Try again after the API request succeeds."}
            </div>
          ) : (
            <>
              <div className="px-6 py-6">
                <PriceChart points={chartPoints} />
              </div>

              <div className="grid gap-3 px-6 py-6 sm:hidden">
                {priceHistory.map((entry) => {
                  const changeClass =
                    entry.changePct === null
                      ? "text-slate-200"
                      : entry.changePct >= 0
                      ? "text-emerald-300"
                      : "text-rose-300";
                  return (
                    <div
                      key={entry.date}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-50">
                          {formatDate(entry.date)}
                        </p>
                        <span className={`text-sm font-semibold ${changeClass}`}>
                          {formatChange(entry.changePct)}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
                        <div>
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-400">
                            Close
                          </p>
                          <p className="text-slate-100">
                            {entry.close !== null
                              ? currencyFormatter.format(entry.close)
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-400">
                            Volume
                          </p>
                          <p className="text-slate-100">
                            {entry.volume !== null
                              ? numberFormatter.format(entry.volume)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[720px] divide-y divide-slate-800 text-sm">
                  <thead className="bg-slate-900/60 text-slate-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Close
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                        % Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {priceHistory.map((entry) => {
                      const changeClass =
                        entry.changePct === null
                          ? "text-slate-200"
                          : entry.changePct >= 0
                          ? "text-emerald-300"
                          : "text-rose-300";
                      return (
                        <tr key={entry.date} className="transition hover:bg-slate-800/60">
                          <td className="whitespace-nowrap px-6 py-4 text-slate-100">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-6 py-4 text-slate-100">
                            {entry.close !== null
                              ? currencyFormatter.format(entry.close)
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            {entry.volume !== null
                              ? numberFormatter.format(entry.volume)
                              : "N/A"}
                          </td>
                          <td className={`px-6 py-4 font-semibold ${changeClass}`}>
                            {formatChange(entry.changePct)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
